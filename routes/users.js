const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Read
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send();
  }
});

//Update by ID
router.put("/users/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(500).json(updatedUser);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(401).send("You can only Update your Profile");
  }
});

//Delete
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
