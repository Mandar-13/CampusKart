const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const { ensureAuth, ensureSeller } = require("../middleware/auth");
const productController = require("../controllers/productController");

router.post(
  "/",
  ensureAuth,
  ensureSeller,
  upload.single("image"),
  productController.createProduct
);

router.get("/", productController.getProducts);
router.get(
  "/my-products",
  ensureAuth,
  productController.getMyProducts
);

router.put(
  "/:id/finalize",
  ensureAuth,
  ensureSeller,
  productController.finalizeProduct
);


module.exports = router;
