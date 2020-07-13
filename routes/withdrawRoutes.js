// NPM modules
const router = require("express").Router();

// Self imports
const User = require("../userSchema");
const auth = require("../middleware");

router.post("/withdraw", auth.checkAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email }, async (err, user) => {
        if (err) {
            req.flash("err", err)
            return res.redirect("/bank");
        } else if (+req.body.withdrawAmount){
            user.balance = user.balance - Number(req.body.withdrawAmount);
            if (user.balance < 0){
                req.flash("err", "You cannot withdraw this amount.")
                return res.redirect("/bank");
            } else {
                await user.save();
            }
            return res.redirect("/bank");
        } else {
            req.flash("err", "Enter a valid value to withdraw.")
            return res.redirect("/bank");
        };
    });
});

module.exports = router;