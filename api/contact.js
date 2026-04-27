import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sendEmail = async ({ name, email, projectType, budget, message }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.');
  }

  const html = `
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
    <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${String(message).replace(/\n/g, '<br />')}</p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'editxsubh <onboarding@resend.dev>',
      to: ['shubhams6068@gmail.com'],
      reply_to: email,
      subject: `New project inquiry from ${name}`,
      html,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || 'Failed to send email notification.');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, projectType, budget, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const { error } = await supabaseAdmin.from('contact_submissions').insert([
      {
        name,
        email,
        project_type: projectType || null,
        budget: budget || null,
        message,
      },
    ]);

    if (error) throw error;

    await sendEmail({ name, email, projectType, budget, message });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send message.' });
  }
}
