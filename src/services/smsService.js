import twilio from 'twilio';

const client = twilio('your-twilio-account-sid', 'your-twilio-auth-token');

export const sendSMS = async (to, message) => {
    try {
        await client.messages.create({
            body: message,
            from: '+1234567890',  // Your Twilio phone number
            to: to  // Recipient phone number
        });
        console.log("SMS Notification sent successfully!");
    } catch (error) {
        console.log("Error sending SMS:", error);
    }
};

