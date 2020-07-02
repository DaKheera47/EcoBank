// NPM modules
const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

// Self made imports
const User = require("../userSchema");
const auth = require("../middleware");

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Routes
router.get('/login', auth.checkNotAuthenticated, (req, res) => {
	res.render('login.ejs', { user: req.user })
})

router.get('/loginfailure', auth.checkNotAuthenticated, (req, res) => {
	res.render('login.ejs', { err: "Please re-enter correct credentials", user: req.user })
})

router.post('/login',
	passport.authenticate('local',
	 { failureRedirect: '/accounts/loginfailure', successRedirect: "/bank" })
);

router.get('/register', auth.checkNotAuthenticated, (req, res) => {
	res.render('register.ejs', { user: req.user })
})

router.post('/register', auth.checkNotAuthenticated, async (req, res) => {
	try {
		User.findOne({ email: req.body.email }, async (err, user) => {
			if (!user){
				const hashedPassword = await bcrypt.hash(req.body.password, 10);

				User.create({
					name: capitalizeFirstLetter(req.body.name),
					email: req.body.email,
					password: hashedPassword,
					balance: 0
				});
				res.render('/accounts/login', { err: "", user: req.user });
			} else {
				res.render("register", { err: "User with that email already exists." });
			};
		})
	} catch (err) {
		res.render("register", { err: err });
	};
});

router.get('/logout', (req, res) => {
	req.logOut()
	res.redirect('/')
});

module.exports = router;