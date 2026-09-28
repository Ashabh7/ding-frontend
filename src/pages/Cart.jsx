import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, setCart } = useContext(CartContext);

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
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Order placed successfully");
    setCart([]);
  } else {
    alert(data.message);
  }
}

  return (
    <div>
      <h1>Cart</h1>

      {cart.map((item) => (
        <div key={item.food._id}>
          <h2>{item.food.name}</h2>
          <p>₹{item.food.price}</p>
          <button onClick={() => increaseQuantity(item.food._id)}>+</button>
          <p>{item.quantity}</p>
          <button onClick={() => decreaseQuantity(item.food._id)}>-</button>
          <br />
          <button onClick={() => removeItem(item.food._id)}>Remove</button>
        </div>
      ))}
      <h2>Total: ₹{total}</h2>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Cart;
