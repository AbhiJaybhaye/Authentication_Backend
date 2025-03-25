const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const mailSender = require("../utils/MailSender");

const OTPSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        otp: { type: String, required: true },
        expiresAt: { type: Date, default:Date.now(),expires:5*60 },
    }
);

async function sendVerificationMail(email,otp){
    try {
        const mailResponse = await mailSender(email,"Verification Otp...",otp)
    } catch (error) {
        console.log("Error occured while sending mails",error);
        throw error;
    }
}
OTPSchema.pre("save", async function (next) {
    await sendVerificationMail(this.email,this.otp);
    next();
});

module.exports = mongoose.model("Otp", OTPSchema);
