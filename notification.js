const sendNotification = (email, subject, message) => {
    console.log('--------------------------------------------------');
    console.log(`MOCK NOTIFICATION SENT TO: ${email}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`MESSAGE: ${message}`);
    console.log('--------------------------------------------------');
};

module.exports = { sendNotification };
