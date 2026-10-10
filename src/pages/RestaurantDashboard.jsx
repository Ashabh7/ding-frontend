import { useEffect, useState } from "react";
import "../css/RestaurantDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

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

  const [restaurantImage, setRestaurantImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    async function getOrders() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/orders`, {
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
      const response = await fetch(`${API_URL}/foods`);
      const data = await response.json();

      if (response.ok) {
        setFoods(data);
      }
    }

    getFoods();

    async function getRestaurant() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/my-restaurant`, {
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
        setRestaurantImage(data.image || "");
      } else {
        alert(data.message);
      }
    }

    getRestaurant();
  }, []);

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/orders/${id}`, {
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

    const response = await fetch(`${API_URL}/foods`, {
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

    const response = await fetch(`${API_URL}/foods/${id}`, {
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

    const response = await fetch(`${API_URL}/foods/${editingFood._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName,
        price: Number(editPrice),
      }),
    });

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
    const formData = new FormData();

    formData.append("name", restaurantName);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("pincode", pincode);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch(
        `${API_URL}/restaurants/${restaurant._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setRestaurant(data);
        setRestaurantImage(data.image || "");
        setSelectedImage(null);
        setImagePreview("");

        alert("Restaurant updated successfully!");
      } else {
        alert(data.message || "Failed to update restaurant");
      }
    } catch (error) {
      console.error("Restaurant update error:", error);
      alert("Unable to update restaurant. Please try again.");
    }
  }

  return (
    <main className="restaurant-dashboard">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <p className="dashboard-label">RESTAURANT PANEL</p>
          <h1>Restaurant Dashboard</h1>
          <p>Manage your orders, menu and restaurant profile.</p>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="section-label">ORDERS</p>
              <h2>Incoming Orders</h2>
            </div>
          </div>

          <div className="dashboard-orders">
            {orders.length === 0 ? (
              <div className="dashboard-empty">
                <h3>No orders yet</h3>
                <p>New customer orders will appear here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div className="dashboard-order-card" key={order._id}>
                  <div className="order-top">
                    <div>
                      <p className="order-label">ORDER ID</p>
                      <h3>#{order._id}</h3>
                    </div>

                    <span className="dashboard-status">{order.status}</span>
                  </div>

                  <div className="dashboard-order-info">
                    <div>
                      <span>Total</span>
                      <strong>₹{order.totalAmount}</strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="section-label">RESTAURANT</p>
              <h2>Restaurant Profile</h2>
            </div>
          </div>

          <form className="dashboard-form" onSubmit={updateRestaurant}>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <div className="form-group form-group-wide">
              <label>Restaurant Image</label>

              {(imagePreview || restaurantImage) && (
                <img
                  src={imagePreview || restaurantImage}
                  alt="Restaurant preview"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setSelectedImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />

              <small>
                Select a new image to replace your current restaurant image.
              </small>
            </div>

            <button type="submit" disabled={!restaurant}>
              Save Restaurant
            </button>
          </form>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="section-label">MENU</p>
              <h2>My Menu</h2>
            </div>
          </div>

          <div className="menu-dashboard-grid">
            {foods
              .filter((food) => food.restaurant === restaurant?._id)
              .map((food) => (
                <div className="menu-dashboard-card" key={food._id}>
                  <div>
                    <h3>{food.name}</h3>
                    <p>₹{food.price}</p>
                  </div>

                  <div className="menu-actions">
                    <button onClick={() => startEditingFood(food)}>
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteFood(food._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {editingFood && (
            <form className="edit-food-form" onSubmit={updateFood}>
              <p className="section-label">EDIT ITEM</p>
              <h3>Edit Food</h3>

              <div className="form-group">
                <label>Food Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>

              <div className="edit-actions">
                <button type="submit">Save Changes</button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingFood(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="section-label">MENU MANAGEMENT</p>
              <h2>Add New Food</h2>
            </div>
          </div>

          <form className="dashboard-form" onSubmit={addFood}>
            <div className="form-group">
              <label>Food Name</label>
              <input
                type="text"
                placeholder="Chicken Alfaham"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                placeholder="220"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
              />
            </div>

            <button type="submit" disabled={!restaurant}>
              Add Food
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default RestaurantDashboard;