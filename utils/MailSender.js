const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email,title,body) =>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        let mailOptions = {
            from: '"Abhijeet J" <abhi08.official@gmail.com>',
            to: `${email}`,
            subject:`${title}`,
            html:`<h3>Otp is valid for 5 mins only </h3> ${body}`
        };
        let info = await transporter.sendMail(mailOptions);
        console.log(info)
        return info;

    } catch (error) {
        console.log(error.message);
    }
};

module.exports = mailSender;
