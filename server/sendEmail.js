// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// // const {onRequest} = require("firebase-functions/v2/https");
// // const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// require('dotenv').config();  // npm install dotenv
// const sgMail = require('@sendgrid/mail');  // npm install @sendgrid/mail
// sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY);

// const VITE_SENDGRID_API_KEY = process.env.VITE_SENDGRID_API_KEY;
// sgMail.setApiKey(VITE_SENDGRID_API_KEY);

// module.exports = async function(reportId, recipientEmail) {
//     const msg = {
//     to: 'sophiafresquez2026@u.northwestern.edu', // Change to your recipient
//     from: 'sophiafresquez13@gmail.com', // Change to your verified sender
//     subject: 'PADS Lake County Report Confirmation',
//     text: `Thank you for notifying PADS Lake County.
//             Your report ID is {reportId}.
//             You can check the status of your report at https://pads-lake-county-good-neighbor.web.app/status.
//             Together, we are helping build a more compassionate and dignified community for all.`,
//     html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
//         <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
//             <h2 style="color: #2c3e50;">Thank you for notifying <span style="color: #1a265a;">PADS Lake County</span></h2>
//             <p>We appreciate your time and commitment to maintaining a compassionate and dignified community in Lake County.</p>
//             <p><strong>Your report ID:</strong> <span style="color: #1a265a;">{reportId}</span></p>
//             <p>You can check the status of your report anytime by visiting:</p>
//             <p>
//             <a href="https://pads-lake-county-good-neighbor.web.app/status" target="_blank" style="color: #1a73e8;">
//                 https://pads-lake-county-good-neighbor.web.app/status
//             </a>
//             </p>
//             <hr style="margin: 30px 0;">
//             <p><strong>PADS Lake County</strong> is committed to providing <strong>advocacy, dignity, and shelter</strong> while supporting individuals and families on their path to stability and independence.</p>
//             <p>Thank you for being a part of this mission.</p>
//             <p style="margin-top: 30px;">
//             <strong>Contact Us:</strong><br>
//             1800 Grand Ave, Waukegan, IL 60085<br>
//             Phone: (847) 689-4357<br>
//             Email: <a href="mailto:info@padslakecounty.org">info@padslakecounty.org</a>
//             </p>
//             <div style="margin-top: 40px; text-align: center;">
//             <img src="cid:padsLogo" alt="PADS Lake County Logo" style="width: 180px; opacity: 0.85;" />
//             </div>
//         </div>
//         </div>
//     `//,
//     // attachments: [
//     //     {
//     //     filename: 'padslogo-dark.png',
//     //     path: './padslogo-dark.png', // Ensure this is the correct local path
//     //     cid: 'padsLogo' // Same as used in the img src above
//     //     }
//     // ]
//     };

//     await sgMail.send(msg);
//     // sgMail
//     // .send(msg)
//     // .then(() => {
//     //     console.log('Email sent');
//     // })
//     // .catch((error) => {
//     //     console.error(error);
//     // });  
// }

import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY);

export async function sendEmail(reportId, recipientEmail) {
  const msg = {
    to: recipientEmail,
    from: 'sophiafresquez13@gmail.com', // Verified sender
    subject: 'PADS Lake County Report Confirmation',
    text: `Thank you for notifying PADS Lake County.
Your report ID is ${reportId}.
You can check the status of your report at https://pads-lake-county-good-neighbor.web.app/status.
Together, we are helping build a more compassionate and dignified community for all.`,
    html: `<p>Thank you for notifying <strong>PADS Lake County</strong>.</p>
<p>Your report ID is: <strong>${reportId}</strong></p>
<p>You can check the status of your report at <a href="https://pads-lake-county-good-neighbor.web.app/status">this link</a>.</p>
<p>Together, we are helping build a more compassionate and dignified community for all.</p>`
  };

  await sgMail.send(msg);
};
