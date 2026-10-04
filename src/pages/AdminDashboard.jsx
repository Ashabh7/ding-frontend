import { useEffect, useState } from "react";
import "../css/AdminDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantEmail, setRestaurantEmail] = useState("");
  const [restaurantPassword, setRestaurantPassword] = useState("");

  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newRestaurantImage, setNewRestaurantImage] = useState("");

  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editRestaurantName, setEditRestaurantName] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editRestaurantImage, setEditRestaurantImage] = useState("");

  const [orders, setOrders] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");

  useEffect(() => {
    async function getUsers() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        alert(data.message);
      }
    }

    async function getRestaurants() {
      const response = await fetch(`${API_URL}/restaurants`);

      const data = await response.json();

      if (response.ok) {
        setRestaurants(data);
      }
    }

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

    getUsers();
    getRestaurants();
    getOrders();
  }, []);

  async function createRestaurantAccount(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/restaurant-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: restaurantName,
        email: restaurantEmail,
        password: restaurantPassword,
        restaurantName: newRestaurantName,
        street: newStreet,
        city: newCity,
        pincode: newPincode,
        image: newRestaurantImage,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Restaurant account created");

      setUsers([...users, data.user]);
      setRestaurants([...restaurants, data.restaurant]);

      setRestaurantName("");
      setRestaurantEmail("");
      setRestaurantPassword("");

      setNewRestaurantName("");
      setNewStreet("");
      setNewCity("");
      setNewPincode("");
      setNewRestaurantImage("");
    } else {
      alert(data.message);
    }
  }

  async function deleteRestaurant(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id));
    } else {
      alert(data.message);
    }
  }

  function startEditingRestaurant(restaurant) {
    setEditingRestaurant(restaurant);
    setEditRestaurantName(restaurant.name);
    setEditStreet(restaurant.location.street);
    setEditCity(restaurant.location.city);
    setEditPincode(restaurant.location.pincode);
    setEditRestaurantImage(restaurant.image || "");
  }

  async function updateRestaurant(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/restaurants/${editingRestaurant._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editRestaurantName,
          image: editRestaurantImage,
          location: {
            street: editStreet,
            city: editCity,
            pincode: editPincode,
          },
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant._id === editingRestaurant._id ? data : restaurant,
        ),
      );

      setEditingRestaurant(null);
    } else {
      alert(data.message);
    }
  }

  async function updateOrderStatus(id, status) {
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

  async function deleteOrder(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setOrders(orders.filter((order) => order._id !== id));
    } else {
      alert(data.message);
    }
  }

  async function deleteUser(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setUsers(users.filter((user) => user._id !== id));
    } else {
      alert(data.message);
    }
  }

  function startEditingUser(user) {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
  }

  async function updateUser(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/users/${editingUser._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setUsers(
        users.map((user) => (user._id === editingUser._id ? data : user)),
      );

      setEditingUser(null);
    } else {
      alert(data.message);
    }
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-container">
        <section className="admin-header">
          <p className="admin-label">ADMIN PANEL</p>
          <h1>Admin Dashboard</h1>
          <p>Manage users, restaurants and orders across Ding!</p>
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <p className="section-label">USERS</p>
            <h2>Manage Users</h2>
          </div>

          <div className="admin-users">
            {users.map((user) => (
              <div className="admin-user-card" key={user._id}>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span>{user.role}</span>
                </div>

                <div className="admin-actions">
                  <button onClick={() => startEditingUser(user)}>Edit</button>

                  <button
                    className="delete-button"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingUser && (
            <form className="admin-form edit-form" onSubmit={updateUser}>
              <p className="section-label">EDIT USER</p>
              <h3>Edit User</h3>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit">Save Changes</button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <p className="section-label">RESTAURANTS</p>
            <h2>Manage Restaurants</h2>
          </div>

          <div className="admin-restaurants">
            {restaurants.map((restaurant) => (
              <div className="admin-restaurant-card" key={restaurant._id}>
                <div>
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.location.street}</p>
                  <p>
                    {restaurant.location.city} — {restaurant.location.pincode}
                  </p>
                </div>

                <div className="admin-actions">
                  <button onClick={() => startEditingRestaurant(restaurant)}>
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => deleteRestaurant(restaurant._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingRestaurant && (
            <form className="admin-form edit-form" onSubmit={updateRestaurant}>
              <p className="section-label">EDIT RESTAURANT</p>
              <h3>Edit Restaurant</h3>

              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  value={editRestaurantName}
                  onChange={(e) => setEditRestaurantName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                />
              </div>

              <div className="form-group form-group-wide">
                <label>Restaurant Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editRestaurantImage}
                  onChange={(e) => setEditRestaurantImage(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="submit">Save Changes</button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingRestaurant(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <p className="section-label">RESTAURANT ACCOUNTS</p>
            <h2>Create Restaurant</h2>
          </div>

          <form className="admin-form" onSubmit={createRestaurantAccount}>
            <div className="form-group">
              <label>Owner Name</label>
              <input
                type="text"
                placeholder="Restaurant owner name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="restaurant@example.com"
                value={restaurantEmail}
                onChange={(e) => setRestaurantEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={restaurantPassword}
                onChange={(e) => setRestaurantPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                type="text"
                placeholder="Restaurant name"
                value={newRestaurantName}
                onChange={(e) => setNewRestaurantName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                placeholder="Street"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
              />
            </div>

            <div className="form-group form-group-wide">
              <label>Restaurant Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={newRestaurantImage}
                onChange={(e) => setNewRestaurantImage(e.target.value)}
              />
            </div>

            <button type="submit">Create Restaurant</button>
          </form>
        </section>

        <section className="admin-section">
          <div className="section-heading">
            <p className="section-label">ORDERS</p>
            <h2>Manage Orders</h2>
          </div>

          <div className="admin-orders">
            {orders.map((order) => (
              <div className="admin-order-card" key={order._id}>
                <div className="order-top">
                  <div>
                    <p className="order-label">ORDER ID</p>
                    <h3>#{order._id}</h3>
                  </div>

                  <span className="admin-status">{order.status}</span>
                </div>

                <div className="order-info">
                  <div>
                    <span>Restaurant</span>
                    <strong>{order.restaurant.name}</strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                </div>

                <div className="order-address">
                  <span>Delivery Address</span>
                  <p>{order.deliveryAddress}</p>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={item.food._id}>
                      <div>
                        <strong>{item.food.name}</strong>
                        <span>Quantity: {item.quantity}</span>
                      </div>

                      <strong>₹{item.price}</strong>
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    className="delete-button"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;