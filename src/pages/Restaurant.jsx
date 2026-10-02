import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/Restaurant.css";
const API_URL = import.meta.env.VITE_API_URL;

function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  const { cart, setCart } = useContext(CartContext);
  const { id } = useParams();

  useEffect(() => {
    async function getRestaurant() {
      const response = await fetch(`${API_URL}/restaurants/${id}`);

      const data = await response.json();

      if (response.ok) {
        setRestaurant(data);
      }
    }

    async function getFoods() {
      const response = await fetch(`${API_URL}/foods`);

      const data = await response.json();

      if (response.ok) {
        const restaurantFoods = data.filter((food) => food.restaurant === id);

        setFoods(restaurantFoods);
      }
    }

    getRestaurant();
    getFoods();
  }, [id]);

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

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="restaurant-page">
      <section className="restaurant-header">
        <p className="restaurant-label">RESTAURANT</p>

        <h1>{restaurant?.name}</h1>

        <p className="restaurant-location">{restaurant?.location.city}</p>

        <input
          className="food-search"
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="menu-section">
        <h2>Menu</h2>

        <div className="food-grid">
          {filteredFoods.map((food) => (
            <div className="food-card" key={food._id}>
              <div className="food-card-content">
                <h3>{food.name}</h3>

                <div className="food-bottom">
                  <p>₹{food.price}</p>

                  <button onClick={() => addToCart(food)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Restaurant;
