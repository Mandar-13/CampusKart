const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { ensureAuth, ensureAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.put(
  "/approve-product/:id",
  ensureAuth,
  ensureAdmin,
  adminController.approveProduct
);

router.get(
  "/analytics",
  ensureAuth,
  ensureAdmin,
  adminController.getAnalytics
);

router.get("/all-products", ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});



module.exports = router;
