const ensureAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

const ensureSeller = (req, res, next) => {
  if (req.user && req.user.role === "Seller") {
    return next();
  }
  return res.status(403).json({ message: "Only sellers can create products" });
};

const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

const ensureOwnerOrAdmin = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await require('../config/db').query(
      'SELECT * FROM products WHERE product_id = $1',
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const foundProduct = product.rows[0];

    if (
      req.user.role === "Admin" ||
      foundProduct.seller_id === req.user.user_id
    ) {
      return next();
    }

    return res.status(403).json({ message: "Not authorized" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Authorization error" });
  }
};


module.exports = { ensureAuth, ensureSeller, ensureAdmin, ensureOwnerOrAdmin };
