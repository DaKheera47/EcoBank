// Imported modules
const   express = require('express'),
        app = express(),
        passport = require('passport'),
        flash = require('express-flash'),
        session = require('express-session'),
        mongoose = require("mongoose"),
        bodyParser = require("body-parser");

// Connecting to database
mongoose.connect("mongodb://localhost/bankAppV3", { useNewUrlParser: true, useUnifiedTopology: true });

// Self made imports
const auth = require("./middleware");
const pass = require("./passport-config").initialize();
const authRoutes = require("./routes/authRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const depositRoutes = require("./routes/depositRoutes");
const transferRoutes = require("./routes/transferRoutes");

// Setting properties for express app
app.use( bodyParser.urlencoded({ extended: true }) );
app.set("view engine", "ejs");
app.use(flash());
app.use(session({ secret: "redditsnoo", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
	res.render('index', { user: req.user });
})

app.get('/bank', auth.checkAuthenticated, (req, res) => {
	res.render('mainBank', { user: req.user, err: "" });
})

app.use("/accounts", authRoutes);
app.use("/user", withdrawRoutes);
app.use("/user", depositRoutes);
app.use("/user", transferRoutes);


app.all('*', (req, res) => {
    res.render("genericError", { err: "Error 404: Page not found" });
});

app.listen(1001, console.log("server on port 1001"));
