// Imported modules
const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const MongoStore = require('connect-mongo')(session);
const PORT = process.env.PORT || 1001;
const MONGO_SECRET = process.env.MONGO_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Self made imports
const auth = require("./middleware");
const pass = require("./passport-config").initialize();
const authRoutes = require("./routes/authRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const depositRoutes = require("./routes/depositRoutes");
const transferRoutes = require("./routes/transferRoutes");

mongoose.connect(MONGO_SECRET, { useNewUrlParser: true, useUnifiedTopology: true });

// Setting properties for express app
app.use( bodyParser.urlencoded({ extended: true }) );
app.set("view engine", "ejs");
app.use(flash());
app.use(session({ secret: SESSION_SECRET, store: new MongoStore({
    url: MONGO_SECRET,
    useNewUrlParser: true,
    useUnifiedTopology: true
}), saveUninitialized: false, resave: false
}));
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

app.listen(PORT, console.log(`Server on port: ${PORT}`));
