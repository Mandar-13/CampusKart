const db = require("../config/db");
const { createProductSchema, finalizeSchema } = require("../validators/productValidator");

// Create Products
exports.createProduct = async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    const { name, description, price } = validatedData;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await db.query(
      `INSERT INTO products (name, description, price, seller_id, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), description || null, price, req.user.user_id, imageUrl]
    );

    res.status(201).json(newProduct.rows[0]);

  } catch (error) {
    next(error);
  }
};


// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT p.product_id,
             p.name,
             p.description,
             p.price,
             p.status,
             p.created_at,
             u.display_name AS seller_name
      FROM products p
      JOIN users u ON p.seller_id = u.user_id
      WHERE p.status = 'approved'
    `;

    const values = [];
    let index = 1;

    if (q) {
      query += ` AND LOWER(p.name) LIKE LOWER($${index})`;
      values.push(`%${q}%`);
      index++;
    }

    if (minPrice) {
      query += ` AND p.price >= $${index}`;
      values.push(minPrice);
      index++;
    }

    if (maxPrice) {
      query += ` AND p.price <= $${index}`;
      values.push(maxPrice);
      index++;
    }

    const offset = (page - 1) * limit;
    query += ` ORDER BY p.created_at DESC LIMIT $${index} OFFSET $${index + 1}`;
    values.push(limit, offset);

    const products = await db.query(query, values);

    res.json(products.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const myProducts = await db.query(
      `SELECT * FROM products
       WHERE seller_id = $1
       ORDER BY created_at DESC`,
      [req.user.user_id]
    );

    res.json(myProducts.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your products" });
  }
};

exports.finalizeProduct = async (req, res, next) => {
  try {
    const validatedData = finalizeSchema.parse(req.body);

    const { finalPrice, buyerEmail } = validatedData;
    const productId = req.params.id;

    const buyer = await db.query(
      "SELECT user_id FROM users WHERE email = $1",
      [buyerEmail]
    );

    if (!buyer.rows.length) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    const updated = await db.query(
      `UPDATE products
       SET final_price = $1,
           buyer_id = $2,
           status = 'sold',
           sold_at = CURRENT_TIMESTAMP
       WHERE product_id = $3
       AND seller_id = $4
       AND status != 'sold'
       RETURNING *`,
      [finalPrice, buyer.rows[0].user_id, productId, req.user.user_id]
    );

    if (!updated.rows.length) {
      return res.status(400).json({ message: "Not authorized or already sold" });
    }

    res.json(updated.rows[0]);

  } catch (error) {
    next(error);
  }
};


