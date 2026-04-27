import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Service Role key — NEVER expose in frontend code
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    contentId,
    contentType, // 'resource' | 'blog'
    userId,
  } = req.body ?? {};

  // 1. Validate inputs
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !contentId || !userId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!['resource', 'blog'].includes(contentType)) {
    return res.status(400).json({ error: 'Invalid contentType. Must be "resource" or "blog".' });
  }

  // 2. Verify Razorpay signature (HMAC SHA256)
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment signature verification failed.' });
  }

  // 3. Fetch content price from DB (never trust client-sent price)
  const tableName = contentType === 'blog' ? 'blogs' : 'resources';
  const { data: contentRow, error: fetchError } = await supabaseAdmin
    .from(tableName)
    .select('id, price, currency, is_paid')
    .eq('id', contentId)
    .single();

  if (fetchError || !contentRow) {
    return res.status(404).json({ error: 'Content not found.' });
  }

  if (!contentRow.is_paid) {
    return res.status(400).json({ error: 'This content is free — no purchase needed.' });
  }

  // 4. Record the purchase (service role key bypasses RLS)
  const purchasePayload = {
    user_id: userId,
    razorpay_order_id,
    razorpay_payment_id,
    amount: contentRow.price,
    currency: contentRow.currency || 'INR',
    ...(contentType === 'blog'
      ? { blog_id: contentId }
      : { resource_id: contentId }),
  };

  const { error: insertError } = await supabaseAdmin
    .from('purchases')
    .insert([purchasePayload]);

  if (insertError) {
    // Duplicate purchase (already owns it) — treat as success
    if (insertError.code === '23505') {
      return res.status(200).json({ success: true, alreadyOwned: true });
    }
    console.error('Purchase insert error:', insertError);
    return res.status(500).json({
      error: 'Failed to record purchase. Contact support with payment ID: ' + razorpay_payment_id,
    });
  }

  return res.status(200).json({ success: true });
}
