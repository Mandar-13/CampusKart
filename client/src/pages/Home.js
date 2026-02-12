import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = (query = "") => {
    axios.get(`http://localhost:5000/api/products?q=${query}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      <form onSubmit={handleSearch}>
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <br />

      {products.length === 0 && <p>No products found</p>}

      {products.map(product => (
        <div key={product.product_id}
             style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>₹ {product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
