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
    const transferAmount = req.body.transferAmount;
    User.findOne({ _id: req.user._id }, async (err, user) => {
        if(err){
            req.flash("err", err);
            res.redirect("/bank");
        } else if (+transferAmount && transferAmount > 0){
            user.balance = user.balance - transferAmount;

            if(user.balance < 0){
                req.flash("err", "You cannot transfer this amount");
                return res.redirect("/bank");

            } else {
                await user.save();

                User.findOne({ _id: req.body.userID }, async (err, foundUser) => {
                    if(err){
                        req.flash("err", err);
                        return res.redirect("/bank");
                    } else if(foundUser){
                            foundUser.balance = foundUser.balance + Number(transferAmount);
                            await foundUser.save();
    
                            req.flash("success", `${transferAmount} has been transfered.`);
                            return res.redirect("/bank");
                        }
                    }
                )
            }
        }
        
    })
})

module.exports = router;
