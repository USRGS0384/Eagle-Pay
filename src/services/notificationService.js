import nodemailer from 'nodemailer';

// Set up a simple email transporter using nodemailer (You can replace with your email provider or SMS API)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example with Gmail
    auth: {
        user: 'your-email@gmail.com',  // Your email
        pass: 'your-email-password'  // Your email password or app-specific password
    }
});

// Send email notification
export const sendNotification = async (userEmail, subject, message) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Notification sent successfully!");
    } catch (error) {
        console.log("Error sending notification:", error);
    }
};

