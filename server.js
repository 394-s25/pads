import express from 'express';  // npm install express
import cors from 'cors';  // npm install cors
import bodyParser from 'body-parser';  // npm install body-parser
import sendEmail from "./sendEmail.cjs";  // Make sure this exports a function

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { reportId, email } = req.body;

  try {
    await sendEmail(reportId, email); 
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).send({ error: "Failed to send email" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});