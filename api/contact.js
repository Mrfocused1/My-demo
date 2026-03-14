export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, business, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'My Demo <onboarding@resend.dev>',
                to: ['hello@mydemo.click'],
                reply_to: email,
                subject: `New enquiry from ${name}${business ? ` — ${business}` : ''}`,
                html: `
                    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#F8F7F5;">
                        <h2 style="font-size:24px;font-weight:800;color:#111111;margin-bottom:24px;">New Enquiry</h2>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#888;font-size:13px;width:120px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#111;font-size:13px;">${name}</td></tr>
                            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#888;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#111;font-size:13px;"><a href="mailto:${email}" style="color:#2A78E4;">${email}</a></td></tr>
                            ${business ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#888;font-size:13px;">Business</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#111;font-size:13px;">${business}</td></tr>` : ''}
                            <tr><td style="padding:16px 0;color:#888;font-size:13px;vertical-align:top;">Message</td><td style="padding:16px 0;color:#111;font-size:13px;white-space:pre-wrap;">${message}</td></tr>
                        </table>
                        <p style="margin-top:32px;font-size:11px;color:#aaa;">Sent from mydemo.click contact form</p>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Contact handler error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}
