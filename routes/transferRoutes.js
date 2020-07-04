// NPM modules
const router = require("express").Router();

// Self made imports
const User = require("../userSchema");
const auth = require("../middleware");

// Routes
router.get("/transfer", auth.checkAuthenticated, async (req, res) => {
	await User.find({}, function (err, users){
		res.render("transfer", { user: req.user, usersArray: users, err: err })
	});
});

router.post("/transfer", auth.checkAuthenticated, (req, res) => {
    // req.user._id is user from whose account money is to be credited
    // req.body.userID is user whose account money is to be added to

    User.findOne({ _id: req.user._id }, async (err, user) => {
        if (err) {
            return res.render("mainBank", { err: err, user: req.user });
        } else if (+req.body.transferAmount && user !== undefined && user !== null){
            console.log(user.balance)
            user.balance = user.balance - Number(req.body.transferAmount);
            if (user.balance < 0){
                return res.render("mainBank", { err: "You cannot transfer this amount." });
            } else {
                await user.save();

                User.findOne({ _id: req.body.userID }, async (err, user) => {
                    if (err) {
                        return res.render("mainBank", { err: err, user: req.user });
                    } else if (+req.body.transferAmount && user !== undefined && user !== null){            
                        user.balance = user.balance + Number(req.body.transferAmount);
                        await user.save();
                    }
                });
            }
        }
    });
    return res.redirect("/bank");
});

module.exports = router;
