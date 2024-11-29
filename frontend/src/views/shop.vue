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

    <!-- Hero Section -->
    <section class="hero">
      <div>Welcome to our Shop</div>
    </section>

    <!-- Products Section -->
    <section class="products">
      <div class="product-card" v-for="product in products" :key="product.id">
        <router-link :to="`/product/${product.id}`">
          <img
            :src="
              product.product_image
                ? `/uploads/${product.product_image.split('/').pop()}`
                : '/images/default-product-image.jpg'
            "
            :alt="product.product_name" />
        </router-link>
        <h3>{{ product.product_name }}</h3>
        <p>Price: ₱{{ product.price.toFixed(2) }}</p>
        <p>Stocks: {{ product.quantity }}</p>
        <button class="add-to-cart" @click="addToCart(product.id)">
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

    <!-- Orders Section -->
    <section class="orders-section">
      <h2>My Orders</h2>
      <div v-if="orders.length > 0">
        <div class="order-card" v-for="order in orders" :key="order.order_id">
          <div class="order-header">
            <h3>Order ID: {{ order.order_id }}</h3>
            <p class="order-date">
              <i class="fas fa-calendar-alt"></i>
              {{ new Date(order.created_at).toLocaleString() }}
            </p>
          </div>
          <div class="order-details">
            <p>
              <strong><i class="fas fa-map-marker-alt"></i> Address:</strong>
              {{ order.address }}
            </p>
            <p>
              <strong><i class="fas fa-phone"></i> Contact Number:</strong>
              {{ order.contact_number }}
            </p>
            <p>
              <strong
                ><i class="fas fa-credit-card"></i> Payment Method:</strong
              >
              {{ order.payment_method }}
            </p>
            <p>
              <strong><i class="fas fa-tag"></i> Status:</strong>
              <span :class="`status ${order.status.toLowerCase()}`">{{
                order.status
              }}</span>
            </p>
            <p>
              <strong
                ><i class="fas fa-money-bill-wave"></i> Total Amount:</strong
              >
              ₱{{ order.total_amount }}
            </p>
          </div>
          <div class="order-products">
            <h4>Products:</h4>
            <ul>
              <li
                v-for="item in order.items"
                :key="item.product_id"
                class="order-item">
                <img
                  :src="`/uploads/${item.product_image.split('/').pop()}`"
                  :alt="item.product_name" />
                <div class="product-info">
                  <p>
                    <i class="fas fa-certificate"></i>
                    {{ item.product_name }} (x{{ item.quantity }})
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="order-actions">
            <button
              v-if="order.status === 'pending'"
              class="btn-action cancel-order"
              @click="cancelOrder(order.order_id)">
              <i class="fas fa-times-circle"></i> Cancel Order
            </button>
            <button class="btn-action track-order">
              <i class="fas fa-truck"></i> Track Order
            </button>
          </div>
        </div>
      </div>
      <p v-else>You don't have any orders yet.</p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: require("@/assets/images/agri_logo.jpeg"),
      defaultProfilePic: require("@/assets/images/default-profile.png"),
      searchQuery: "",
      dropdownVisible: false,
      user: {
        profile_pic: null,
      },
      products: [],
      orders: [],
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    search() {
      console.log("Search query:", this.searchQuery);
    },
    addToCart(productId) {
      console.log("Add to cart:", productId);
    },
    cancelOrder(orderId) {
      if (confirm("Are you sure you want to cancel this order?")) {
        console.log("Order canceled:", orderId);
      }
    },
    confirmLogout() {
      if (confirm("Are you sure you want to log out?")) {
        console.log("Logging out...");
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
</style>
