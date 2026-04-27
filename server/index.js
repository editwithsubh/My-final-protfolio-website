require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['https://editxsubh.com', 'https://www.editxsubh.com', 'http://localhost:5173', 'http://localhost:8080'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Validate required environment variables — fail fast if missing
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('FATAL: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables must be set.');
  console.error('Copy server/.env.example to server/.env and fill in your credentials.');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set.');
  console.error('Get the service role key from Supabase Dashboard → Settings → API.');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Create Order (server-side price lookup) ────────────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { contentId, contentType = 'resource', userId } = req.body;

    if (!contentId) {
      return res.status(400).json({ error: 'contentId is required.' });
    }

    // Fetch price from Supabase — never trust client
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

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// ─── Verify Payment & Record Purchase ────────────────────────────────
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      contentId,
      contentType,
      userId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !contentId || !userId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (!['resource', 'blog'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid contentType.' });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment signature verification failed.' });
    }

    // Fetch content price from DB
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
      return res.status(400).json({ error: 'This content is free.' });
    }

    // Record purchase
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
      if (insertError.code === '23505') {
        return res.status(200).json({ success: true, alreadyOwned: true });
      }
      console.error('Purchase insert error:', insertError);
      return res.status(500).json({
        error: 'Failed to record purchase. Payment ID: ' + razorpay_payment_id,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Payment Gateway running on http://localhost:${PORT}`);
});
