const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1️⃣ Check if user already exists
        const existingUser = await db.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id],
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        // 2️⃣ If not, insert new user
        const role =
          profile.emails[0].value === process.env.ADMIN_EMAIL
            ? "Admin"
            : "Buyer";

        const newUser = await db.query(
          `INSERT INTO users (google_id, email, display_name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
          [profile.id, profile.emails[0].value, profile.displayName, role],
        );

        done(null, newUser.rows[0]);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
