import { useEffect, useState } from "react";

function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [editingFood, setEditingFood] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    async function getOrders() {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        alert(data.message);
      }
    }

    getOrders();

    async function getFoods() {
      const response = await fetch("http://localhost:5000/foods");

      const data = await response.json();

      if (response.ok) {
        setFoods(data);
      }
    }

    getFoods();

    async function getRestaurant() {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/my-restaurant", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRestaurant(data);
        setRestaurantName(data.name);
        setStreet(data.location.street);
        setCity(data.location.city);
        setPincode(data.location.pincode);
      } else {
        alert(data.message);
      }
    }

    getRestaurant();
  }, []);

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: data.status } : order,
        ),
      );
    } else {
      alert(data.message);
    }
  }

  async function addFood(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/foods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: foodName,
        price: Number(foodPrice),
        restaurant: restaurant._id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setFoods([...foods, data]);
      setFoodName("");
      setFoodPrice("");
    } else {
      alert(data.message);
    }
  }

  async function deleteFood(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/foods/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setFoods(foods.filter((food) => food._id !== id));
    } else {
      alert(data.message);
    }
  }

  function startEditingFood(food) {
    setEditingFood(food);
    setEditName(food.name);
    setEditPrice(food.price);
  }

  async function updateFood(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/foods/${editingFood._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice),
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setFoods(
        foods.map((food) => (food._id === editingFood._id ? data : food)),
      );

      setEditingFood(null);
      setEditName("");
      setEditPrice("");
    } else {
      alert(data.message);
    }
  }

  async function updateRestaurant(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/restaurants/${restaurant._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: restaurantName,
          location: {
            street: street,
            city: city,
            pincode: pincode,
          },
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setRestaurant(data);
      alert("Restaurant updated");
    } else {
      alert(data.message);
    }
  }

  return (
    <div>
      <h1>Restaurant Dashboard</h1>

      <h2>Incoming Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}

      <h2>Restaurant Profile</h2>

      <form onSubmit={updateRestaurant}>
        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        <button type="submit" disabled={!restaurant}>
          Save Restaurant
        </button>
      </form>

      <h2>My Menu</h2>

      {foods
        .filter((food) => food.restaurant === restaurant?._id)
        .map((food) => (
          <div key={food._id}>
            <h3>{food.name}</h3>
            <p>₹{food.price}</p>
            <button onClick={() => startEditingFood(food)}>Edit</button>
            <button onClick={() => deleteFood(food._id)}>Delete</button>{" "}
          </div>
        ))}

      {editingFood && (
        <form onSubmit={updateFood}>
          <h2>Edit Food</h2>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
          />

          <button type="submit">Save Changes</button>

          <button type="button" onClick={() => setEditingFood(null)}>
            Cancel
          </button>
        </form>
      )}

      <h2>Add New Food</h2>

      <form onSubmit={addFood}>
        <input
          type="text"
          placeholder="Food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={foodPrice}
          onChange={(e) => setFoodPrice(e.target.value)}
        />

        <button type="submit" disabled={!restaurant}>
          Add Food
        </button>
      </form>
    </div>
  );
}

export default RestaurantDashboard;
