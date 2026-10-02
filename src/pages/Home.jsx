import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getRestaurants() {
      const response = await fetch(`${API_URL}/restaurants`);

      const data = await response.json();

      if (response.ok) {
        setRestaurants(data);
      }
    }

    getRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="home-page">
      <section className="hero">
        <p className="hero-label">GOOD FOOD. GOOD MOOD.</p>

        <h1>What are you craving?</h1>

        <p className="hero-text">
          Discover great food from restaurants around you.
        </p>

        <input
          className="restaurant-search"
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="restaurants-section">
        <h2>Restaurants</h2>

        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <Link
              to={`/restaurant/${restaurant._id}`}
              key={restaurant._id}
              className="restaurant-card"
            >
              <div className="restaurant-card-content">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.location.city}</p>

                <span>View Menu →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
