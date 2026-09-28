import { useEffect, useState } from "react";

function Orders() {
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

  return (
    <div>
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div key={order._id}>
          <h2>Order ID: {order._id}</h2>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Orders;