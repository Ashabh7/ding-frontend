import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  return (
    <div>
      <h1>Ding! Home</h1>

      {restaurants.map((restaurant) => (
        <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id}>
          <h2>{restaurant.name}</h2>
          <p>{restaurant.location.city}</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;
