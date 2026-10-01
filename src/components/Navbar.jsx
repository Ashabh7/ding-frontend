import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  let role = null;

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    role = payload.role;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <h2 className="logo">Ding!</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {role === "customer" && (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
              </>
            )}

            {role === "restaurant" && (
              <Link to="/restaurant-dashboard">
                Restaurant Dashboard
              </Link>
            )}

            {role === "admin" && (
              <Link to="/admin-dashboard">
                Admin Dashboard
              </Link>
            )}

            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;