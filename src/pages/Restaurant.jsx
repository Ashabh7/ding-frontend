import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../css/Restaurant.css";
import { getRestaurantImage } from "../utils/restaurantImage";

const API_URL = import.meta.env.VITE_API_URL;

function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { cart, setCart } = useContext(CartContext);
  const { id } = useParams();

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const [restaurantResponse, foodsResponse] = await Promise.all([
          fetch(`${API_URL}/restaurants/${id}`),
          fetch(`${API_URL}/foods`),
        ]);

        const restaurantData = await restaurantResponse.json();
        const foodsData = await foodsResponse.json();

        if (restaurantResponse.ok) {
          setRestaurant(restaurantData);
        }

        if (foodsResponse.ok) {
          const restaurantFoods = foodsData.filter(
            (food) =>
              food.restaurant === id ||
              food.restaurant?._id === id,
          );

          setFoods(restaurantFoods);
        }
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, [id]);

  function addToCart(food) {
    if (
      cart.length > 0 &&
      cart[0].food.restaurant !== food.restaurant
    ) {
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

  if (loading) {
    return (
      <main className="restaurant-page">
        <section className="restaurant-loading">
          <span>DING!</span>
          <p>Loading menu...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="restaurant-page">
      <section className="restaurant-header">
        <img
          className="restaurant-hero-image"
          src={getRestaurantImage(restaurant)}
          alt=""
        />

        <div className="restaurant-header-overlay" />

        <div className="restaurant-header-content">
          <p className="restaurant-label">RESTAURANT</p>

          <h1>{restaurant?.name}</h1>

          <p className="restaurant-location">
            {restaurant?.location?.city}
          </p>

          <label className="food-search-shell">
            <span aria-hidden="true">⌕</span>
            <input
              className="food-search"
              type="text"
              placeholder="Search the menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search menu"
            />
          </label>
        </div>
      </section>

      <section className="menu-section">
        <div className="menu-heading">
          <div>
            <p className="section-eyebrow">THE MENU</p>
            <h2>What are we having?</h2>
          </div>

          <span>{filteredFoods.length} items</span>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="menu-empty">
            <h3>No food found</h3>
            <p>Try another search.</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <article className="food-card" key={food._id}>
                <div className="food-card-content">
                  <div className="food-card-top">
                    <span className="food-dot" />
                    <span>AVAILABLE</span>
                  </div>

                  <h3>{food.name}</h3>

                  <div className="food-bottom">
                    <p>₹{food.price}</p>

                    <button onClick={() => addToCart(food)}>
                      Add <span>+</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Restaurant;