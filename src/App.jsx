import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import CartProvider from "./context/CartContext";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import AdminDashboard from "./pages/Admindashboard";

function App() {
  return (
    <BrowserRouter>
    <CartProvider>

      <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      
    </CartProvider>
    </BrowserRouter>
  );
}

export default App;