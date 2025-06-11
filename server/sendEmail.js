import 'dotenv/config';
import sgMail from '@sendgrid/mail';

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_KEY) {
  throw new Error('Missing SENDGRID_API_KEY in .env');
}
sgMail.setApiKey(SENDGRID_KEY);

export default async function sendEmail(reportId, recipientEmail) {
  const msg = {
    to: recipientEmail,
    from: 'outreach@padslakecounty.org',   // must be a verified sender in SendGrid
    subject: 'PADS Lake County Report Confirmation',
    text: `Thank you for notifying PADS Lake County.
            Your report ID is ${reportId}.
            You can check the status of your report at https://pads-lake-county-good-neighbor.web.app/status.
            Together, we are helping build a more compassionate and dignified community for all.`,
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50;">Thank you for notifying <span style="color: #1a265a;">PADS Lake County</span></h2>
            <p>We appreciate your time and commitment to maintaining a compassionate and dignified community in Lake County.</p>
            <p><strong>Your report ID:</strong> <span style="color: #1a265a;">${reportId}</span></p>
            <p>You can check the status of your report anytime by visiting:</p>
            <p>
            <a href="https://pads-lake-county-good-neighbor.web.app/status" target="_blank" style="color: #1a73e8;">
                https://pads-lake-county-good-neighbor.web.app/status
            </a>
            </p>
            <hr style="margin: 30px 0;">
            <p><strong>PADS Lake County</strong> is committed to providing <strong>advocacy, dignity, and shelter</strong> while supporting individuals and families on their path to stability and independence.</p>
            <p>Thank you for being a part of this mission.</p>
            <p style="margin-top: 30px;">
            <strong>Contact Us:</strong><br>
            1800 Grand Ave, Waukegan, IL 60085<br>
            Phone: (847) 689-4357<br>
            Email: <a href="mailto:info@padslakecounty.org">info@padslakecounty.org</a>
            </p>
            <div style="margin-top: 40px; text-align: center;">
            <img src="cid:padsLogo" alt="PADS Lake County Logo" style="width: 180px; opacity: 0.85;" />
            </div>
        </div>
        </div>
    `
  };

  const [res] = await sgMail.send(msg);
  console.log('DONE: SendGrid responded with', res.statusCode);   // should be 202
}
