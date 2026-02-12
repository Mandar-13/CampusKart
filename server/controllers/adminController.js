const db = require("../config/db");

// Approve Product
exports.approveProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await db.query(
      `UPDATE products
       SET status = 'approved'
       WHERE product_id = $1
       RETURNING *`,
      [productId]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve product" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await db.query(`SELECT COUNT(*) FROM users`);
    const totalSellers = await db.query(`SELECT COUNT(*) FROM users WHERE role = 'Seller'`);
    const totalProducts = await db.query(`SELECT COUNT(*) FROM products`);
    const approvedProducts = await db.query(`SELECT COUNT(*) FROM products WHERE status = 'approved'`);
    const soldProducts = await db.query(`SELECT COUNT(*) FROM products WHERE status = 'sold'`);
    const totalRevenue = await db.query(
      `SELECT COALESCE(SUM(final_price), 0) AS revenue FROM products WHERE status = 'sold'`
    );

    res.json({
      totalUsers: totalUsers.rows[0].count,
      totalSellers: totalSellers.rows[0].count,
      totalProducts: totalProducts.rows[0].count,
      approvedProducts: approvedProducts.rows[0].count,
      soldProducts: soldProducts.rows[0].count,
      totalRevenue: totalRevenue.rows[0].revenue
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

