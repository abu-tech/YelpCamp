const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");


router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), users.loginUser);

router.get("/logout", users.logoutUser);

router.route("/mycampgrounds")
    .get(users.myCampgroundsIndex);

module.exports = router;