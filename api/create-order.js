import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay server credentials are missing.' });
  }

  const { contentId, contentType = 'resource', userId } = req.body ?? {};
  if (!contentId) {
    return res.status(400).json({ error: 'contentId is required.' });
  }

  // Fetch price server-side — never trust client-sent price
  const tableName = contentType === 'blog' ? 'blogs' : 'resources';
  const { data: content, error: fetchError } = await supabaseAdmin
    .from(tableName)
    .select('price, currency, is_paid')
    .eq('id', contentId)
    .single();

  if (fetchError || !content) {
    return res.status(404).json({ error: 'Content not found.' });
  }

  if (!content.is_paid || !content.price || content.price <= 0) {
    return res.status(400).json({ error: 'This item is free or has no price set.' });
  }

  try {
    const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: Math.round(content.price * 100), // paise
      currency: content.currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        contentId,
        contentType,
        userId: userId || '',
      },
    });
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ error: 'Failed to create payment order.' });
  }
}
