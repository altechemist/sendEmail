import express from "express";
import nodemailer from "nodemailer";
require ("dotenv").config();

const app = express();
const port = 3000;

const emailHost = process.env.VITE_EMAIL_HOST;
const senderEmail = process.env.VITE_SENDER_EMAIL;
const emailPassword = process.env.VITE_EMAIL_PASSWORD;

// Middleware to parse JSON request bodies
app.use(express.json());


// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: 465,
  secure: true, // use SSL
  auth: {
    user: senderEmail, // your Gmail address
    pass: emailPassword, // your Gmail password or app-specific password
  },
});

// Helper function to send confirmation email
async function sendConfirmationEmail(email, name) {
  try {
    const mailOptions = {
      from: '"Luxe Hotel 🏨" <reservations@luxe-hotel.com>', // sender address
      to: email, // list of receivers
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

// Room reservation endpoint
app.post("/send-email", async (req, res) => {
  const { name, email, roomType, checkInDate, checkOutDate } = req.body;

  // Basic validation
  if (!name || !email || !roomType || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Process the reservation (e.g., store in database, etc.)

  // Send the confirmation email
  await sendConfirmationEmail(email, name);

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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
