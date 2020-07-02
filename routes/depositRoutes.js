// NPM modules
const router = require("express").Router();

// Self imports
const User = require("../userSchema");
const auth = require("../middleware");

router.post("/deposit", auth.checkAuthenticated, (req, res) => {
    User.findOne({ email: req.user.email }, async (err, user) => {
        if (err) {
            return res.render("mainBank", { err: err, user: req.user });
        } else if (+req.body.depositAmount) {
            user.balance = user.balance + Number(req.body.depositAmount);
            await user.save();
            return res.redirect("/bank");
        } else {
            return res.render("mainBank", { err: "Enter a valid value to deposit", user: req.user });
        }
    });
});


module.exports = router;