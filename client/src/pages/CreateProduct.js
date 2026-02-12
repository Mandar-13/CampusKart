import { useState } from "react";
import axios from "axios";

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/products",
        form,
        { withCredentials: true }
      );

      alert("Product Created Successfully!");
      setForm({ name: "", description: "", price: "" });

    } catch (err) {
      alert("You must be logged in as Seller");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateProduct;
