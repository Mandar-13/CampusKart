const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send("Login Successful 🎉");
  }
);

// Get logged-in user
router.get("/user", (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  res.status(401).json({ message: "Not logged in" });
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("http://localhost:3000");
  });
});


module.exports = router;
