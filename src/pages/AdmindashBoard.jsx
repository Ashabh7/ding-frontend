import { useEffect, useState } from "react";

function AdminDashboard() {
  console.log("ADMIN DASHBOARD LOADED");

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantEmail, setRestaurantEmail] = useState("");
  const [restaurantPassword, setRestaurantPassword] = useState("");
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editRestaurantName, setEditRestaurantName] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [orders, setOrders] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");

  useEffect(() => {
    async function getUsers() {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/users", {
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
      const response = await fetch("http://localhost:5000/restaurants");

      const data = await response.json();

      if (response.ok) {
        setRestaurants(data);
      }
    }

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

    getUsers();
    getRestaurants();
    getOrders();
  }, []);

  async function createRestaurantAccount(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/restaurant-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: restaurantName,
        email: restaurantEmail,
        password: restaurantPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Restaurant account created");

      setUsers([...users, data]);

      setRestaurantName("");
      setRestaurantEmail("");
      setRestaurantPassword("");
    } else {
      alert(data.message);
    }
  }

  async function deleteRestaurant(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/restaurants/${id}`, {
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
  }

  async function updateRestaurant(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/restaurants/${editingRestaurant._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editRestaurantName,
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

  async function deleteOrder(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/orders/${id}`, {
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

    const response = await fetch(`http://localhost:5000/users/${id}`, {
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
    console.log("Edit User clicked");

    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
  }

  async function updateUser(e) {
    e.preventDefault();

    console.log("updateUser fired");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/users/${editingUser._id}`,
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
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>

      {users.map((user) => (
        <div key={user._id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={() => deleteUser(user._id)}>Delete User</button>
          <button onClick={() => startEditingUser(user)}>Edit User</button>
        </div>
      ))}

      <h2>Restaurants</h2>

      {restaurants.map((restaurant) => (
        <div key={restaurant._id}>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.location.street}</p>
          <p>{restaurant.location.city}</p>
          <p>{restaurant.location.pincode}</p>

          <button onClick={() => deleteRestaurant(restaurant._id)}>
            Delete
          </button>
          <button onClick={() => startEditingRestaurant(restaurant)}>
            Edit
          </button>
        </div>
      ))}

      <h2>All Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>

          <p>Restaurant: {order.restaurant.name}</p>

          <p>Total: ₹{order.totalAmount}</p>

          <p>Delivery Address: {order.deliveryAddress}</p>

          <p>Status: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button onClick={() => deleteOrder(order._id)}>Delete Order</button>

          {order.items.map((item) => (
            <div key={item.food._id}>
              <p>{item.food.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
            </div>
          ))}
        </div>
      ))}

      {editingRestaurant && (
        <form onSubmit={updateRestaurant}>
          <h2>Edit Restaurant</h2>

          <input
            type="text"
            value={editRestaurantName}
            onChange={(e) => setEditRestaurantName(e.target.value)}
          />

          <input
            type="text"
            value={editStreet}
            onChange={(e) => setEditStreet(e.target.value)}
          />

          <input
            type="text"
            value={editCity}
            onChange={(e) => setEditCity(e.target.value)}
          />

          <input
            type="text"
            value={editPincode}
            onChange={(e) => setEditPincode(e.target.value)}
          />

          <button type="submit">Save Changes</button>

          <button type="button" onClick={() => setEditingRestaurant(null)}>
            Cancel
          </button>
        </form>
      )}

      <h2>Create Restaurant Account</h2>

      <form onSubmit={createRestaurantAccount}>
        <input
          type="text"
          placeholder="Restaurant owner name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Restaurant email"
          value={restaurantEmail}
          onChange={(e) => setRestaurantEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={restaurantPassword}
          onChange={(e) => setRestaurantPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>

      {editingUser && (
        <form onSubmit={updateUser}>
          <h2>Edit User</h2>

          <input
            type="text"
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />

          <input
            type="email"
            value={editUserEmail}
            onChange={(e) => setEditUserEmail(e.target.value)}
          />

          <select
            value={editUserRole}
            onChange={(e) => setEditUserRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Save Changes</button>

          <button type="button" onClick={() => setEditingUser(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminDashboard;
