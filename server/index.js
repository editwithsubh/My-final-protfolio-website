require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Validate required environment variables — fail fast if missing
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('FATAL: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables must be set.');
  console.error('Copy server/.env.example to server/.env and fill in your credentials.');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects integer amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
    
  } catch (error) {
    console.error('Error creating local fast order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Razorpay Payment Gateway running on http://localhost:${PORT}`);
});
