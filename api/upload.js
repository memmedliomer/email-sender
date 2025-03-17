const nodemailer = require("nodemailer");
const xlsx = require("xlsx");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

// Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "omrmmmdli736@gmail.com",   // Your Gmail address
    pass: "sojf oxwh hqdh wttq",      // Your app-specific password
  },
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  // Handle file upload
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file" });
    }

    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const emails = data.map((row) => row.Email); // Assuming column name is "Email"
    if (!emails || emails.length === 0) {
      return res.status(400).json({ message: "No emails found in the file" });
    }

    // Send emails to all recipients
    const subject = "Test email for YouTube";
    const text = "Hi, Tomi.";

    emails.forEach((email) => {
      const mailOptions = {
        from: "omrmmmdli736@gmail.com",  // Your Gmail address
        to: email,
        subject: subject,
        text: text,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email to ${email}: ${error}`);
        } else {
          console.log(`Email sent to ${email}: ${info.response}`);
        }
      });
    });

    return res.status(200).json({ message: "Emails sent successfully!" });
  });
};
