import express from 'express';
import cors from 'cors';
import sendEmail from './sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { reportId, email } = req.body;

  console.log("Email API called with:", reportId, email); ////////

  if (!reportId || !email) {
    return res.status(400).json({ error: 'Missing reportId or email' });
  }

  try {
    await sendEmail(reportId, email);
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ success: false, message: 'Email failed to send' });
  }
});

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Email API running on http://localhost:${PORT}`));
const PORT = 8888; 
app.listen(PORT, '::', () => {  // bind to all IPv6 + IPv4
  console.log(`Email API running on http://localhost:${PORT}`);
});