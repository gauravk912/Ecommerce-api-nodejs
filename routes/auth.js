const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//Create User
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
      phone: req.body.phone,
    });
    const user = await newUser.save();
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      // name: req.body.name,
      email: req.body.email,
      // password: req.body.password,
      // phone:req.body.phone
    });
    !user && res.status(400).json("wrong Credentials test mess");
    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate && res.status(422).json("Incorrect password");

    const { password, ...others } = user._doc;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
