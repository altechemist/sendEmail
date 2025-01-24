import express from "express";
import nodemailer from "nodemailer";
import cors from "cors"; // Use ES module import here

const app = express();
const port = 3000;

// Read environment variables for email configuration
const emailHost = process.env.VITE_EMAIL_HOST;
const senderEmail = process.env.VITE_SENDER_EMAIL;
const emailPassword = process.env.VITE_EMAIL_PASSWORD;

// Middleware to parse JSON request bodies
app.use(express.json());

// Allow requests from localhost:5173 (your frontend)
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: emailHost, // Host for your SMTP server (e.g., 'smtp.gmail.com')
  port: 465, // Port for SSL connection
  secure: true, // use SSL
  auth: {
    user: senderEmail, // Your email address (e.g., 'your-email@gmail.com')
    pass: emailPassword, // Your app-specific password (or regular password if no 2FA)
  },
});

// Helper function to send confirmation email
async function sendConfirmationEmail(
  name,
  email,
  roomType,
  checkInDate,
  checkOutDate
) {
  try {
    const mailOptions = {
      from: '"Luxe Hotel 🏨" <reservations@luxe-hotel.com>', // sender address
      to: email, // recipient address
      subject: "Reservation Confirmation ✔", // Subject line
      text:
        `Hello ${name},\n\nYour room reservation has been confirmed with the following details:\n\n` +
        `Name: ${name}\nEmail: ${email}\nRoom Type: ${roomType}\nCheck-in Date: ${checkInDate}\nCheck-out Date: ${checkOutDate}\n\n` +
        `Thank you for choosing us!\n\nBest regards,\nLuxe Hotel`,
      html:
        `<b>Hello ${name},</b><br><br>` +
        `Your room reservation has been confirmed with the following details:<br><br>` +
        `<b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><b>Room Type:</b> ${roomType}<br>` +
        `<b>Check-in Date:</b> ${checkInDate}<br><b>Check-out Date:</b> ${checkOutDate}<br><br>` +
        `Thank you for choosing us!<br><br>Best regards,<br>Luxe Hotel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Helper function to send contact email
async function sendContactEmail(name, email, message) {
  try {
    const mailOptions = {
      from: email, // sender address
      to: senderEmail, // recipient address
      subject: "Portfolio Message", // Subject line
      text: message,
      html:
        `<b>Hello ${name},</b><br><br>` +
        `Your room reservation has been confirmed with the following details:<br><br>` +
        `<b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><b>Room Type:</b> ${roomType}<br>` +
        `<b>Check-in Date:</b> ${checkInDate}<br><b>Check-out Date:</b> ${checkOutDate}<br><br>` +
        `Thank you for choosing us!<br><br>Best regards,<br>Luxe Hotel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


      // Room reservation endpoint
app.post("/send-email", async (req, res) => {
  const { name, email, roomType, checkInDate, checkOutDate } = req.body;

  // Basic validation
  if (!name || !email || !roomType || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Send the confirmation email
  await sendConfirmationEmail(name, email, roomType, checkInDate, checkOutDate);

  // Respond with a success message
  res.status(200).json({
    message: `Reservation confirmed for ${name}. A confirmation email has been sent.`,
    reservation: {
      name,
      email,
      roomType,
      checkInDate,
      checkOutDate,
    },
  });
});

// Send contact form email endpoint
app.post("/send-contact-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const mailOptions = {};
    // Send the contact email
    await sendContactEmail(name, email, message);

    // Respond with a success message
    res.status(200).json({
      message: `Contact email sent from ${name}.`,
      contact: {
        name,
        email,
        message,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "An error occurred while sending the email" });
  }
});



      // Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
