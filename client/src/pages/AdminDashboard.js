import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);

  const fetchAnalytics = () => {
    axios.get("http://localhost:5000/api/admin/analytics", {
      withCredentials: true
    })
      .then(res => setAnalytics(res.data))
      .catch(err => {
        console.error(err);
        alert("Admin access only");
      });
  };

  const fetchPendingProducts = () => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        // We need pending products, but public API only shows approved.
        // So we manually fetch from admin route.
      })
      .catch(err => console.error(err));
  };

  // NEW: Fetch pending from DB using special route
  const fetchAdminProducts = () => {
    axios.get("http://localhost:5000/api/admin/all-products", {
      withCredentials: true
    })
      .then(res => {
        const pending = res.data.filter(p => p.status === "pending");
        setPendingProducts(pending);
      })
      .catch(err => console.error(err));
  };

  const approveProduct = (id) => {
    axios.put(
      `http://localhost:5000/api/admin/approve-product/${id}`,
      {},
      { withCredentials: true }
    )
      .then(() => {
        alert("Product Approved!");
        fetchAnalytics();
        fetchAdminProducts();
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAnalytics();
    fetchAdminProducts();
  }, []);

  if (!analytics) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Analytics</h2>

      <p>Total Users: {analytics.totalUsers}</p>
      <p>Total Products: {analytics.totalProducts}</p>
      <p>Sold Products: {analytics.soldProducts}</p>
      <p>Total Revenue: ₹ {analytics.totalRevenue}</p>

      <hr />

      <h3>Pending Products</h3>

      {pendingProducts.length === 0 && <p>No pending products</p>}

      {pendingProducts.map(product => (
        <div key={product.product_id}
             style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>₹ {product.price}</p>
          <button onClick={() => approveProduct(product.product_id)}>
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
