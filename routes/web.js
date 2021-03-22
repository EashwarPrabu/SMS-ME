const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../model/User");

//! FOR SERVING SIGNUP PAGE
 router.get('/login', (req, res) => {
     res.render('login');
 });
 router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post("/signup", async (req, res) => {
    console.log(req.body);

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
        });
        const savedUser = await newUser.save();
        console.log(`${savedUser.name} has been saved!`);
        // Redirect user to login page!
        return res.redirect('/login');
    } catch (err) {
        console.log("Error: " + err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // REDIRECT USER TO SIGNUP PAGE
             res.redirect('signup');
            console.log("NO SUCH USER FOUND!");
        }
        const hashedPassword = user.password;
        const userPassword = req.body.password;
        const isPasswordCorrect = await bcrypt.compare(
            userPassword,
            hashedPassword
        );
        if (isPasswordCorrect) {
            // REDIRECT TO DASHBOARD
             res.redirect('dashboard');
            console.log("CORRECT PASSWORD!");
        } else {
            // REDIRECT TO LOGIN SAYING INCORRECT PASSWORD!
             res.redirect('login');
            console.log("WRONG PASSWORD!");
        }
    } catch (err) {
        console.log("ERROR: " + err);
    }
});

module.exports = router;
