import { useEffect, useState } from "react";
import "../css/Orders.css";

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

  const statuses = [
    "pending",
    "confirmed",
    "preparing",
    "out-for-delivery",
    "delivered",
  ];

  return (
    <main className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <p className="orders-label">YOUR ORDERS</p>
          <h1>Order History</h1>
          <p>Track your recent orders and their delivery status.</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet</h2>
            <p>Your orders will appear here once you place one.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStatusIndex = statuses.indexOf(order.status);

              return (
                <article className="order-card" key={order._id}>
                  <div className="order-card-header">
                    <div>
                      <p className="order-label">ORDER</p>
                      <h2>{order.restaurant.name}</h2>
                    </div>

                    <span className="order-status">{order.status}</span>
                  </div>

                  <p className="order-id">#{order._id}</p>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div className="order-item" key={item.food._id}>
                        <div>
                          <h3>{item.food.name}</h3>
                          <p>Quantity: {item.quantity}</p>
                        </div>

                        <strong>₹{item.price}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-details">
                    <div>
                      <span>Delivery Address</span>
                      <p>{order.deliveryAddress}</p>
                    </div>

                    <div>
                      <span>Total</span>
                      <strong>₹{order.totalAmount}</strong>
                    </div>
                  </div>

                  <div className="status-tracker">
                    {statuses.map((status, index) => (
                      <div
                        key={status}
                        className={`status-step ${
                          index <= currentStatusIndex ? "completed" : ""
                        } ${index === currentStatusIndex ? "current" : ""}`}
                      >
                        <div className="status-dot">
                          {index < currentStatusIndex
                            ? "✓"
                            : index === currentStatusIndex
                              ? "●"
                              : ""}
                        </div>

                        <span>{status}</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;
