<template>
  <div>
    <header class="header">
      <div class="logo">
        <img :src="logo" alt="AgriEcommerce Logo" />
        <h1>AgriEcommerce</h1>
      </div>
      <nav class="navbar">
        <router-link to="/welcome" class="nav-link active"
          ><i class="fas fa-home"></i>Home</router-link
        >
        <router-link to="/shop"
          ><i class="fas fa-shopping-cart"></i>Shop</router-link
        >
        <router-link to="/aboutus"
          ><i class="fas fa-info-circle"></i>About Us</router-link
        >
        <router-link to="/news"
          ><i class="fas fa-newspaper"></i>News</router-link
        >
        <router-link to="/contact"
          ><i class="fas fa-envelope"></i>Contact</router-link
        >
      </nav>
      <div class="icons">
        <div class="search-bar">
          <input type="text" placeholder="Search" />
          <button type="submit"><i class="fas fa-search"></i></button>
        </div>
        <div class="user-icon" @click="toggleDropdown">
          <img
            :src="
              user.profile_pic
                ? '/uploads/' + user.profile_pic
                : defaultProfilePic
            "
            alt="User Profile" />
        </div>
        <div class="dropdown-menu" :class="{ show: dropdownVisible }">
          <router-link to="/userProfile">User Profile</router-link>
          <router-link to="/change-password">Change Password</router-link>
          <a href="#" @click.prevent="confirmLogout">Logout</a>
        </div>
        <router-link to="/cart"
          ><i class="fas fa-shopping-cart"></i
        ></router-link>
      </div>
    </header>

    <section class="hero">
      <div>Your Cart</div>
    </section>

    <section>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cart.length === 0">
            <td colspan="6">Your cart is empty.</td>
          </tr>
          <tr v-for="item in cart" :key="item.id">
            <td>
              <img
                :src="`/uploads/${item.product_image.split('/').pop()}`"
                :alt="item.product_name" />
            </td>
            <td>{{ item.product_name }}</td>
            <td>${{ parseFloat(item.price).toFixed(2) }}</td>
            <td>
              <input
                type="number"
                class="quantity-input"
                v-model.number="item.quantity"
                @change="updateQuantity(item.id, item.quantity)" />
            </td>
            <td>${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</td>
            <td>
              <button class="remove-button" @click="removeFromCart(item.id)">
                <i class="fas fa-trash-alt"></i> Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="cart.length > 0" class="total">
        Total Amount: ₱{{ totalAmount.toFixed(2) }}
      </div>
      <button v-if="cart.length > 0" class="checkout-button" @click="checkout">
        Proceed to Checkout
      </button>
    </section>

    <div v-show="showSuccessMessage" class="success-message">
      Item removed successfully!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: require("@/assets/images/agri_logo.jpeg"),
      defaultProfilePic: require("@/assets/images/default-profile.png"),
      cart: [], // Data will be populated with cart items
      user: {
        profile_pic: null, // Replace with actual user data
      },
      totalAmount: 0, // Calculate the total amount dynamically
      searchQuery: "",
      dropdownVisible: false,
      showSuccessMessage: false,
    };
  },
  methods: {
    toggleDropdown(event) {
      event.stopPropagation();
      this.dropdownVisible = !this.dropdownVisible;
    },
    confirmLogout() {
      const confirmation = confirm("Are you sure you want to log out?");
      if (confirmation) {
        window.location.href = "/logout";
      }
    },
    checkout() {
      this.$router.push("/checkout");
    },
    removeFromCart(itemId) {
      const confirmation = confirm(
        "Are you sure you want to remove this item from your cart?"
      );
      if (confirmation) {
        fetch(`/remove-from-cart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: itemId }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              this.showSuccessMessage = true;
              setTimeout(() => {
                this.loadCart(); // Refresh the cart after item is removed
              }, 2000);
            } else {
              alert(data.message || "Failed to remove item from cart.");
            }
          })
          .catch((error) => {
            console.error("Error removing item:", error);
            alert("An error occurred. Please try again.");
          });
      }
    },
    updateQuantity(itemId, newQuantity) {
      const parsedQuantity = parseInt(newQuantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
      }

      fetch(`/update-cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: itemId, quantity: parsedQuantity }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.loadCart();
          } else {
            alert("Failed to update cart.");
          }
        });
    },
    search() {
      // Add search logic here
    },
    loadCart() {
      fetch("/cart") // Fetch cart data
        .then((response) => response.json())
        .then((data) => {
          this.cart = data.cart;
          this.totalAmount = data.totalAmount;
        });
    },
  },
  mounted() {
    this.loadCart(); // Load the cart data when component mounts
    // Optionally fetch user info if needed
    fetch("/user-info")
      .then((response) => response.json())
      .then((data) => {
        this.user = data.user;
      });
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #f4f4f4;
}

.header .logo {
  display: flex;
  align-items: center;
}

.header .logo img {
  width: 50px;
  height: auto;
  margin-right: 10px;
}

.header .logo h1 {
  font-size: 24px;
  color: #2d7b3b;
}

.navbar {
  display: flex;
}

.navbar a {
  margin: 0 15px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.navbar a i {
  margin-right: 5px;
}

.navbar a:hover,
.navbar a.active {
  color: #2d7b3b;
}

.icons {
  display: flex;
  align-items: center;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.search-bar input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: -5px;
}

.search-bar button {
  background-color: #2d7b3b;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #25612c;
}

.user-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-icon img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.cart-icon {
  margin-left: 15px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.cart-icon::before {
  content: "\f07a";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

.hero {
  width: 100%;
  height: 400px;
  background: url("@/assets/images/vegetable.jpg") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
}

.cart-table {
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
}

.cart-table th,
.cart-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.cart-table th {
  background-color: #f4f4f4;
}

.cart-table img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.total {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
}

.checkout-button {
  display: block;
  width: 200px;
  margin: 20px auto;
  background-color: #2d7b3b;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.checkout-button:hover {
  background-color: #25612c;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 35px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 150px;
  z-index: 1;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-menu a {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-menu a:hover {
  background-color: #f4f4f4;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #c0392b;
}

.remove-button i {
  margin-right: 5px;
}

.success-message {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #28a745;
  color: white;
  padding: 20px;
  border-radius: 5px;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.success-message.show {
  display: block;
  opacity: 1;
}

.quantity-input {
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
</style>
