import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { getRestaurantImage } from "../utils/restaurantImage";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getRestaurants() {
      try {
        const response = await fetch(`${API_URL}/restaurants`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load restaurants");
        }

        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
        <div className="hero-content">
          <p className="hero-label">GOOD FOOD. GOOD MOOD.</p>

          <h1>
            Your next
            <span> craving </span>
            starts here.
          </h1>

          <p className="hero-text">
            Discover local favourites, browse menus and get the food you want
            without the fuss.
          </p>

          <label className="search-shell">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              className="restaurant-search"
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search restaurants"
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear restaurant search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="hero-decoration" aria-hidden="true"></div>
      </section>

      <section className="restaurants-section">
        <div className="section-intro">
          <div>
            <p className="section-eyebrow">EXPLORE</p>
            <h2>Restaurants</h2>
          </div>

          {!loading && (
            <p className="restaurant-count">
              {filteredRestaurants.length}{" "}
              {filteredRestaurants.length === 1 ? "place" : "places"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="restaurant-grid">
            {[1, 2, 3].map((item) => (
              <div className="restaurant-skeleton" key={item}>
                <div />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="home-state">
            <span className="state-mark">!</span>
            <h3>We couldn't load the restaurants.</h3>
            <p>{error}</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="home-state">
            <span className="state-mark">⌕</span>
            <h3>No restaurants found</h3>
            <p>Try a different search.</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant, index) => (
              <Link
                to={`/restaurant/${restaurant._id}`}
                key={restaurant._id}
                className="restaurant-card"
              >
                <img
                  src={getRestaurantImage(restaurant)}
                  alt={restaurant.name}
                  className="restaurant-card-image"
                  loading={index > 1 ? "lazy" : "eager"}
                />

                <div className="restaurant-card-overlay" />

                <div className="restaurant-card-content">
                  <div>
                    <p className="restaurant-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.location.city}</p>
                  </div>

                  <span>
                    View Menu <b>↗</b>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
