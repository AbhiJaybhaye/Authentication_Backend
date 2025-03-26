const express = require('express')
const router = express.Router();

const { login, signup, requestOTP } = require("../Controllers/Authentication");
const { auth, isAdmin, isUser } = require("../Middlewares/Auth")

router.post("/", signup);
router.post("/login", login);
router.post("/requestOtp",requestOTP);

// Protected Route for users
router.get("/user", auth, isUser, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Users"
    })
});

// Protected Route for Admin 
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Admin"
    })
});

module.exports = router;