const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const multer = require("multer");
const { ZodError } = require("zod");

const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: "Too many requests, please try again later.",
});

app.use(limiter);

/* =========================
   BODY PARSING
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
========================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   SESSION + PASSPORT
========================= */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* =========================
   ROUTES
========================= */

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err);

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      errors: err.errors.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }

  // Default fallback
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
