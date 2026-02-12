import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", {
      withCredentials: true
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/create">Create Product</Link> |{" "}
      <Link to="/admin">Admin</Link> |{" "}

      {!user ? (
        <a href="http://localhost:5000/auth/google">Login</a>
      ) : (
        <>
          <span style={{ marginLeft: "10px" }}>
            Welcome, {user.display_name}
          </span>{" "}
          |{" "}
          <a href="http://localhost:5000/auth/logout">Logout</a>
        </>
      )}
    </nav>
  );
}

export default Navbar;
