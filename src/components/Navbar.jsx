import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();

  let role = null;

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    role = payload.role;
  }

  // Calculate the total number of food items, including quantities.
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function handleLogout() {
    logout();
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
                <Link to="/cart" className="cart-nav-link">
                  Cart
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>

                <Link to="/orders">Orders</Link>
              </>
            )}

            {role === "restaurant" && (
              <Link to="/restaurant-dashboard">
                Restaurant Dashboard
              </Link>
            )}

            {role === "admin" && (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;