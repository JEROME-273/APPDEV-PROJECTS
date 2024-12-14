<template>
  <div>
    <!-- Header Section -->
    <header class="header">
      <div class="logo">
        <img :src="logo" alt="AgriEcommerce Logo" />
        <h1>AgriEcommerce</h1>
      </div>
      <nav class="navbar">
        <router-link to="/welcome"><i class="fas fa-home"></i>Home</router-link>
        <router-link to="/shop"
          ><i class="fas fa-shopping-cart"></i>Shop</router-link
        >
        <router-link to="/aboutus"
          ><i class="fas fa-info-circle"></i>About Us</router-link
        >
        <router-link to="/contact"
          ><i class="fas fa-envelope"></i>Contact</router-link
        >
      </nav>
      <div class="icons">
        <div class="search-bar">
          <input type="text" placeholder="Search" v-model="searchQuery" />
          <button @click="search"><i class="fas fa-search"></i></button>
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
          <a href="" @click.prevent="confirmLogout">Logout</a>
        </div>
        <router-link to="/cart"
          ><i class="fas fa-shopping-cart"></i
        ></router-link>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div>Welcome to our Shop</div>
    </section>

    <!-- Products Section -->
    <section class="products">
      <div class="product-card" v-for="product in products" :key="product.id">
        <router-link :to="`/product/${product.id}`">
          <img :src="product.product_image" :alt="product.product_name" />
        </router-link>
        <h3>{{ product.product_name }}</h3>
        <p>Price: ₱{{ product.price.toFixed(2) }}</p>
        <p>Stocks: {{ product.quantity }}</p>
        <button class="add-to-cart" @click.prevent="addToCart(product.id)">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </section>

    <!-- View Cart Button -->
    <div style="text-align: center">
      <button class="view-cart-btn" @click="$router.push('/cart')">
        <i class="fas fa-shopping-cart"></i> View Cart
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      logo: require("@/assets/images/agri_logo.jpeg"),
      defaultProfilePic: require("@/assets/images/default-profile.png"),
      dropdownVisible: false,
      user: { profile_pic: null },
      products: [], // Store products here
      searchQuery: "", // For search functionality
    };
  },
  mounted() {
    // Fetch products when component is mounted
    this.fetchProducts();
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    search() {
      console.log("Search query:", this.searchQuery);
      // Implement search functionality if needed
    },
    addToCart(productId) {
      console.log("Add to cart:", productId);
      // Implement add to cart functionality here, e.g., API call
    },
    confirmLogout() {
      if (confirm("Are you sure you want to log out?")) {
        // Clear user session or token if applicable
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        // Redirect to login page
        this.$router.push("/login");
      }
    },
    // Fetch products from the API
    async fetchProducts() {
      try {
        const response = await axios.get("/shop");
        if (response.data.success) {
          console.log("Fetched products:", response.data.products); // Debugging line
          this.products = response.data.products;
        } else {
          console.error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
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
  position: relative;
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

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
}

.product-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 200px;
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-card img {
  max-width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
}

.product-card h3 {
  font-size: 18px;
  color: #2d7b3b;
  margin-bottom: 10px;
}

.product-card p {
  font-size: 16px;
  margin: 5px 0;
}

.add-to-cart {
  background-color: #2d7b3b; /* Green background */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart i {
  margin-right: 5px;
}

.add-to-cart:hover {
  background-color: #25612c; /* Darker green on hover */
}

.alert {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-color: #2d7b3b;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
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

.view-cart-btn {
  background-color: #2d7b3b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 20px auto;
  width: fit-content;
}

.view-cart-btn i {
  margin-right: 8px;
}

.view-cart-btn:hover {
  background-color: #25612c;
}
.orders-section {
  padding: 20px;
  background-color: #f9f9f9;
}

.order-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-header h3 {
  font-size: 22px;
  color: #2d7b3b;
}

.order-date {
  font-size: 14px;
  color: #666;
}

.order-details p {
  font-size: 16px;
  margin: 8px 0;
}

.order-details i {
  margin-right: 8px;
  color: #2d7b3b;
}

.order-products ul {
  list-style: none;
  padding: 0;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.order-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 5px;
}

.product-info p {
  font-size: 16px;
}

.order-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-action {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.btn-action i {
  margin-right: 5px;
}

.cancel-order {
  background-color: #e74c3c;
  color: white;
}

.track-order {
  background-color: #2d7b3b;
  color: white;
}

.cancel-order:hover {
  background-color: #c0392b;
}

.track-order:hover {
  background-color: #25612c;
}

.status {
  font-weight: bold;
}

.status.pending {
  color: #f39c12;
}

.status.shipped {
  color: #3498db;
}

.status.delivered {
  color: #2ecc71;
}
.canceled-orders {
  background-color: #f8d7da;
  border-radius: 8px;
  margin-top: 40px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.canceled-orders h2 {
  font-size: 24px;
  font-weight: bold;
  color: #721c24;
  text-align: center;
  margin-bottom: 20px;
}

.canceled-order-list {
  list-style-type: none;
  padding: 0;
}

.canceled-order-list .order {
  background-color: #ffffff;
  border: 1px solid #e0a1a1;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.canceled-order-list .order.canceled h3 {
  font-size: 18px;
  color: #721c24;
  font-weight: bold;
}

.canceled-order-list .order .order-details {
  font-size: 14px;
  color: #5a5a5a;
}

.canceled-order-list .order .order-details p {
  margin: 8px 0;
}

.canceled-order-list .order .order-details p strong {
  font-weight: bold;
  color: #333;
}

.canceled-order-list .order .order-products {
  margin-top: 10px;
}

.canceled-order-list .order .order-products ul {
  list-style-type: none;
  padding: 0;
}

.canceled-order-list .order .order-products li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.canceled-order-list .order .order-products img {
  max-width: 50px;
  max-height: 50px;
  margin-right: 10px;
  border-radius: 5px;
}

.canceled-order-list .order .order-products .product-info {
  flex-grow: 1;
}

.canceled-order-list .order .order-products .product-info p {
  font-size: 14px;
  margin: 0;
  color: #333;
}

.canceled-order-list .order .order-status {
  margin-top: 15px;
  font-size: 14px;
  font-weight: bold;
  color: #721c24;
}
@media (max-width: 768px) {
  .canceled-orders {
    padding: 15px;
  }

  .canceled-order-list .order {
    padding: 10px;
  }

  .canceled-order-list .order h3 {
    font-size: 16px;
  }

  .canceled-order-list .order .order-details p {
    font-size: 12px;
  }

  .canceled-order-list .order .order-products li {
    flex-direction: column;
    align-items: flex-start;
  }

  .canceled-order-list .order .order-products img {
    margin-bottom: 8px;
  }
}

/* Responsive styles */
@media (max-width: 1024px) {
  .products {
    justify-content: space-evenly;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .navbar a {
    margin: 5px 10px;
  }

  .icons {
    margin-top: 20px;
    width: 100%;
    justify-content: space-between;
  }

  .search-bar {
    flex-grow: 1;
    margin-right: 10px;
  }

  .search-bar input {
    width: 100%;
  }

  .hero {
    height: 300px;
    font-size: 28px;
  }

  .product-card {
    width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .header .logo h1 {
    font-size: 20px;
  }

  .navbar a {
    font-size: 14px;
  }

  .hero {
    height: 200px;
    font-size: 24px;
  }

  .product-card {
    width: 100%;
  }

  .dropdown-menu {
    width: 120px;
  }

  .dropdown-menu a {
    font-size: 12px;
  }

  .view-cart-btn {
    font-size: 14px;
    padding: 8px 16px;
  }
}

/* Responsive styles for orders section */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-actions {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-item img {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
