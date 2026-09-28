import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const { cart, setCart } = useContext(CartContext);

  function addToCart(food) {
    if (cart.length > 0 && cart[0].food.restaurant !== food.restaurant) {
      alert("You can only order from one restaurant at a time");
      return;
    }

    const existingItem = cart.find((item) => item.food._id === food._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.food._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      return;
    }

    setCart([
      ...cart,
      {
        food,
        quantity: 1,
      },
    ]);
  }

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data));
    fetch("http://localhost:5000/foods")
      .then((res) => res.json())
      .then((data) => {
        const restaurantFoods = data.filter((food) => food.restaurant === id);

        setFoods(restaurantFoods);
      });
  }, [id]);

  return (
    <div>
      <h1>{restaurant?.name}</h1>

      <div>
        {foods.map((food) => (
          <div key={food._id}>
            <h2>{food.name}</h2>
            <p>₹{food.price}</p>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurant;
