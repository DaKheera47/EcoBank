// NPM modules
const router = require("express").Router();

// Self imports
const User = require("../userSchema");
const auth = require("../middleware");

router.post("/withdraw", auth.checkAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email }, async (err, user) => {
        if (err) {
            return res.render("mainBank", { err: err, user: req.user });
        } else if (+req.body.withdrawAmount){
            user.balance = user.balance - Number(req.body.withdrawAmount);
            if (user.balance < 0){
                return res.render("mainBank", { err: "You cannot withdraw this amount.", user: req.user });
            } else {
                await user.save();
            }
            return res.redirect("/bank");
        } else {
            return res.render("mainBank", { err: "Enter a valid value to withdraw", user: req.user });
        };
    });
});

module.exports = router;