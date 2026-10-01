import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "../css/Cart.css";

function Cart() {
  const { cart, setCart } = useContext(CartContext);

  const [address, setAddress] = useState("");

  function increaseQuantity(id) {
    setCart(
      cart.map((item) =>
        item.food._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(id) {
    setCart(
      cart.map((item) =>
        item.food._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  }

  function removeItem(id) {
    setCart(cart.filter((item) => item.food._id !== id));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0,
  );

  async function placeOrder() {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        restaurant: cart[0].food.restaurant,
        items: cart.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully");
      setCart([]);
      setAddress("");
    } else {
      alert(data.message);
    }
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <p className="cart-label">YOUR ORDER</p>
          <h1>Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add something delicious and come back here.</p>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.food._id}>
                  <div>
                    <h2>{item.food.name}</h2>
                    <p>₹{item.food.price}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => decreaseQuantity(item.food._id)}>
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQuantity(item.food._id)}>
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.food._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <aside className="checkout-card">
              <h2>Order Summary</h2>

              <div className="total-row">
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>

              <textarea
                placeholder="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <button className="place-order-button" onClick={placeOrder}>
                Place Order
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
