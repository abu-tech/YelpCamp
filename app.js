if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./utilities/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const mongoose = require('mongoose');

main().catch(err => console.log("ERROR CONNECTING DATABASE!!", err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log("CONNECTED TO DATABASE!!")
}

const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/users");

const secret = process.env.SECRET || "secret"
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on("error", (err) => {
    console.log("session error", err);
});

const sessionConfiq = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "static")));
app.use(session(sessionConfiq));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/",
    "https://code.jquery.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/"
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://cdn.jsdelivr.net"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzgcoehkm/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc: ["https://res.cloudinary.com/dv5vm4sqh/"],
            childSrc: ["blob:"]
        }
    })
);

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userSuccess = req.flash("userSuccess");
    res.locals.currentUser = req.user;
    if (!["/login", "/register", "/"].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    next();
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", engine);

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    throw new AppError("PAGE NOT FOUND!", 404);
    next();
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) message = "OH NO! SOMETHING WENT WRONG";
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Server Started on port 3000! ");
});