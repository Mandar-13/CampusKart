const { z } = require("zod");

// Create Product Validation
const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive")
});

// Finalize Deal Validation
const finalizeSchema = z.object({
  finalPrice: z.coerce.number().positive("Final price must be positive"),
  buyerEmail: z.string().email("Valid buyer email required")
});

module.exports = {
  createProductSchema,
  finalizeSchema
};
