import nodemailer from 'nodemailer';
import twilio from 'twilio';
import 'dotenv/config'
/*
            TODO: use new email for twilio
*/
const accountSid = 'ACa8a793af586c81043d8625f1745c69db';
const authToken = 'VBXQXP51LX19KXF1GBT3TVQ2';
const client = twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
    /*
            TODO: create new email for shop
    */
    service: 'gmail',
    auth: {
        user: 'duyvo3001@gmail.com', 
        pass: 'your-email-password'
    }
});
const generateUnlockCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendUnlockCode = async (email: string, phone: string) => {
    const unlockCode = generateUnlockCode();

    // Save the unlock code to the user's record in the database
    await shopModel.updateOne({ email }, { unlockCode });

    // Send the unlock code via email
    /*
            TODO: add operator in " from" :'your-email@gmail.com'
    */
    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Account Unlock Code',
        text: `Your account unlock code is: ${unlockCode}`
    });

    // Send the unlock code via SMS
    await client.verify.v2.services(process.env.TWILIO!)
        .verifications
        .create({ to: phone, channel: 'sms' })
        .then(verification => console.log(verification.sid));

    return unlockCode;
};

export {
    transporter,
    accountSid,
    authToken,
    client,
    sendUnlockCode
};