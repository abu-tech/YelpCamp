const User = require("../models/user");
const Campground = require("../models/campground");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("userSuccess", "Welcome To Yelp Camp ");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {
    req.flash("userSuccess", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged Out Good Bye!!");
        res.redirect("/campgrounds");
    });
}

module.exports.myCampgroundsIndex = async(req, res) => {
    const id = res.locals.currentUser._id;
    const campgrounds = await Campground.find({ author: { $in: id } });
    res.render("users/mycampgrounds", { campgrounds });
}