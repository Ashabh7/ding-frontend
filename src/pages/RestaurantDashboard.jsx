import { useEffect, useState } from "react";

function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getOrders() {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        alert(data.message);
      }
    }

    getOrders();
  }, []);

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: data.status } : order,
        ),
      );
    } else {
      alert(data.message);
    }
  }

  return (
    <div>
      <h1>Restaurant Dashboard</h1>

      <h2>Incoming Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default RestaurantDashboard;
