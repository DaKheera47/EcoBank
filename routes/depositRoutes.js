// NPM modules
const router = require("express").Router();

// Self imports
const User = require("../userSchema");
const auth = require("../middleware");

router.post("/deposit", auth.checkAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email }, async (err, user) => {
        if (err) {
            req.flash("err", err);
            return res.redirect("/bank");
        } else if (+req.body.depositAmount) {
            user.balance = user.balance + Number(req.body.depositAmount);
            await user.save();
            return res.redirect("/bank");
        } else {
            req.flash("err", "Enter a valid value to deposit")
            return res.redirect("/bank");
        }
    });
});

module.exports = router;