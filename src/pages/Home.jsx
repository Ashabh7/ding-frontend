import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getRestaurants() {
      const response = await fetch("http://localhost:5000/restaurants");

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
    <div>
      <h1>Ding! Home</h1>

      <input
        type="text"
        placeholder="Search restaurants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredRestaurants.map((restaurant) => (
        <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id}>
          <h2>{restaurant.name}</h2>
          <p>{restaurant.location.city}</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;