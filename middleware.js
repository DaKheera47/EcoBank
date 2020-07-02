function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.redirect("/accounts/login");
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/bank')
	}
	next()
}

module.exports = { checkAuthenticated, checkNotAuthenticated }