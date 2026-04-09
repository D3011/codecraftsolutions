export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, phone, biz, type, pkg, msg } = req.body;

  if (!name || !biz || !msg) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailBody = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
      <h2 style="color:#1a3cff;margin-bottom:4px;">New Enquiry — CodeCraft Solutions</h2>
      <hr style="border:none;border-top:1px solid #e2ddd4;margin:16px 0;"/>
      <table style="width:100%;font-size:15px;line-height:1.7;">
        <tr><td style="color:#666;width:140px;">Name</td><td><strong>${name}</strong></td></tr>
        <tr><td style="color:#666;">Phone</td><td>${phone || 'Not provided'}</td></tr>
        <tr><td style="color:#666;">Business</td><td>${biz}</td></tr>
        <tr><td style="color:#666;">Business Type</td><td>${type || 'Not selected'}</td></tr>
        <tr><td style="color:#666;">Package</td><td>${pkg || 'Not selected'}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e2ddd4;">
        <p style="color:#666;margin:0 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">Message</p>
        <p style="margin:0;color:#0d0d0d;">${msg.replace(/\n/g, '<br/>')}</p>
      </div>
      <p style="margin-top:20px;font-size:13px;color:#999;">Sent from your CodeCraft Solutions portfolio website.</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'CodeCraft Enquiry <onboarding@resend.dev>',
        to: ['deepakmanjunathan33@gmail.com'],
        subject: `New Website Enquiry from ${name} — ${biz}`,
        html: emailBody
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: result.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
