export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, business, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0efed;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0efed;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#152F4D;padding:32px 40px;border-radius:4px 4px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;letter-spacing:0.05em;color:#ffffff;">mydemo</span><span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;letter-spacing:0.05em;color:#2A78E4;">.click</span>
                </td>
                <td align="right">
                  <span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);">New Enquiry</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">

            <!-- Intro -->
            <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#2A78E4;">Incoming</p>
            <h1 style="margin:0 0 32px 0;font-size:28px;font-weight:900;color:#111111;letter-spacing:-0.02em;">You have a new enquiry</h1>

            <!-- Divider -->
            <div style="height:3px;background:#152F4D;margin-bottom:32px;width:40px;"></div>

            <!-- Fields -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid #f0efed;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="130" style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999999;vertical-align:top;padding-top:2px;">Name</td>
                      <td style="font-size:15px;font-weight:600;color:#111111;">${name}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid #f0efed;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="130" style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999999;vertical-align:top;padding-top:2px;">Email</td>
                      <td style="font-size:15px;font-weight:600;"><a href="mailto:${email}" style="color:#2A78E4;text-decoration:none;">${email}</a></td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${business ? `
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid #f0efed;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="130" style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999999;vertical-align:top;padding-top:2px;">Business</td>
                      <td style="font-size:15px;font-weight:600;color:#111111;">${business}</td>
                    </tr>
                  </table>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:14px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="130" style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999999;vertical-align:top;padding-top:2px;">Message</td>
                      <td style="font-size:15px;color:#333333;line-height:1.6;white-space:pre-wrap;">${message}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Reply CTA -->
            <div style="margin-top:36px;padding:24px;background:#f0efed;border-left:4px solid #2A78E4;">
              <p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999;">Quick Reply</p>
              <a href="mailto:${email}?subject=Re: Your enquiry — mydemo.click" style="display:inline-block;background:#152F4D;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">Reply to ${name} &rarr;</a>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0efed;padding:24px 40px;border-top:1px solid #e5e5e5;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:#aaaaaa;">
                  Sent via the contact form at <a href="https://mydemo.click" style="color:#2A78E4;text-decoration:none;">mydemo.click</a>
                </td>
                <td align="right" style="font-size:11px;color:#aaaaaa;">
                  &copy; 2026 mydemo.click
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

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
                html,
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
