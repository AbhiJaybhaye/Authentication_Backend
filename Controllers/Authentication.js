const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const Otp = require("../Models/OtpModel");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");
dotenv.config();

// Step 1: Request OTP for Signup/Login
exports.requestOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
           return res.status(401).json({
                success:false,
                message:"User Already existed..!!"
           });
        }
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false, 
            specialChars: false, 
            digits: true, 
            lowerCaseAlphabets: false
        });

        const otpPayload = {email,otp};

        const otpBody = await Otp.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
            otp: otp,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error sending OTP, please try again later",
        });
    }
};

// Step 2: Signup - Verify OTP & Create User
exports.signup = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        // Verify OTP
        if( !name || !email || !password || !otp)
        {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                success: false,
                message: "User already existed"
            });
        }

        const isValidOTP = await Otp.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Check valid OTP:",isValidOTP);

        if (isValidOTP.length==0) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP Found",
            });
        }
        else if(otp!==isValidOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "User cannot be registered, Please try again later",
        });
    }
};

// Step 3: Login - Verify Password & Login User
exports.login = async (req,res) => {
    try
    {
        const {email,password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message : "Please fill all the details carefully",
            })
        }

        // check for register user 
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success : false,
                message : "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email : user.email,
            id : user._id
        };


        if(await bcrypt.compare(password,user.password)){
            // password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }

            res.cookie("token",token,options).status(200).json({
                success : true,
                user,
                message:"User logged in successfully",
                data: { userId: user._id, token },
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success : false,
                message : "Password does not match",
            })
        }
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false" 
        })
    }
}