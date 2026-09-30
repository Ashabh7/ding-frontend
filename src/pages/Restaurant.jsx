import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  const { cart, setCart } = useContext(CartContext);
  const { id } = useParams();

  useEffect(() => {
    async function getRestaurant() {
      const response = await fetch(
        `http://localhost:5000/restaurants/${id}`,
      );

      const data = await response.json();

      if (response.ok) {
        setRestaurant(data);
      }
    }

    async function getFoods() {
      const response = await fetch("http://localhost:5000/foods");

      const data = await response.json();

      if (response.ok) {
        const restaurantFoods = data.filter(
          (food) => food.restaurant === id,
        );

        setFoods(restaurantFoods);
      }
    }

    getRestaurant();
    getFoods();
  }, [id]);

  function addToCart(food) {
    if (
      cart.length > 0 &&
      cart[0].food.restaurant !== food.restaurant
    ) {
      alert("You can only order from one restaurant at a time");
      return;
    }

    const existingItem = cart.find(
      (item) => item.food._id === food._id,
    );

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

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>{restaurant?.name}</h1>

      <input
        type="text"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredFoods.map((food) => (
        <div key={food._id}>
          <h2>{food.name}</h2>
          <p>₹{food.price}</p>

          <button onClick={() => addToCart(food)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Restaurant;