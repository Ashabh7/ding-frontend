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

  const statuses = [
    "pending",
    "confirmed",
    "preparing",
    "out-for-delivery",
    "delivered",
  ];

  return (
    <div>
      <h1>My Orders</h1>

      {orders.map((order) => {
        const currentStatusIndex = statuses.indexOf(order.status);

        return (
          <div key={order._id}>
            <h2>Order ID: {order._id}</h2>

            <h3>{order.restaurant.name}</h3>

            {order.items.map((item) => (
              <div key={item.food._id}>
                <p>{item.food.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            ))}

            <h3>Total: ₹{order.totalAmount}</h3>
            <p>Delivery Address: {order.deliveryAddress}</p>
            <p>Status: {order.status}</p>

            <div className="flex flex-col gap-4">
              {statuses.map((status, index) => (
                <div key={status} className="flex items-center gap-3">
                  <span>
                    {index < currentStatusIndex
                      ? "✓"
                      : index === currentStatusIndex
                        ? "●"
                        : "○"}
                  </span>

                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;
