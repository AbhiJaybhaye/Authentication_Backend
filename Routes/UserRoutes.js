const express = require('express')
const router = express.Router();

const { login, signup, requestOTP } = require("../Controllers/Authentication");

router.post("/", signup);
router.post("/login", login);
router.post("/requestOtp",requestOTP);

module.exports = router;