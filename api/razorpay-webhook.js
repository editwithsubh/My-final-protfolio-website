import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable Vercel's default body parsing so we can verify the raw body HMAC
export const config = {
  api: {
    bodyParser: false,
  },
};

// Read raw body from request stream
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signature = req.headers['x-razorpay-signature'];

  // Read raw body for HMAC verification
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    return res.status(400).json({ error: 'Could not read request body' });
  }

  // Verify webhook signature using raw body
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSig !== signature) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    // Check if purchase already recorded (from verify-payment handler)
    const { data: existing } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();

    if (existing) {
      // Already recorded via the verify-payment endpoint
      return res.status(200).json({ status: 'already_recorded' });
    }

    // Read contentId, contentType, userId from Razorpay order notes
    // (set during create-order)
    const notes = payment.notes || {};
    if (!notes.contentId || !notes.userId || !notes.contentType) {
      console.warn('Webhook: missing notes, cannot auto-fulfill order', orderId);
      return res.status(200).json({ status: 'missing_notes' });
    }

    const purchasePayload = {
      user_id: notes.userId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      ...(notes.contentType === 'blog'
        ? { blog_id: notes.contentId }
        : { resource_id: notes.contentId }),
    };

    const { error } = await supabaseAdmin
      .from('purchases')
      .insert([purchasePayload]);

    if (error && error.code !== '23505') {
      console.error('Webhook insert error:', error);
    }
  }

  return res.status(200).json({ status: 'ok' });
}

