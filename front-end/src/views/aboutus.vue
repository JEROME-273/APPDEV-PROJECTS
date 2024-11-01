<template>
  <div>
    <!-- Header Section -->
    <header class="header">
      <div class="logo">
        <img src="@/assets/images/agri_logo.jpeg" alt="AgriEcommerce Logo" />
        <h1>AgriEcommerce</h1>
      </div>
      <nav class="navbar">
        <router-link to="/welcome"><i class="fas fa-home"></i>Home</router-link>
        <router-link to="/shop"><i class="fas fa-shopping-cart"></i>Shop</router-link>
        <router-link to="/aboutus"><i class="fas fa-info-circle"></i>About Us</router-link>
        <router-link to="/news"><i class="fas fa-newspaper"></i>News</router-link>
        <router-link to="/contact"><i class="fas fa-envelope"></i>Contact</router-link>
      </nav>
      <div class="icons">
        <div class="search-bar">
          <input type="text" placeholder="Search" />
          <button type="submit"><i class="fas fa-search"></i></button>
        </div>
        <div class="user-icon" @click="toggleDropdown">
          <img :src="user && user.profile_pic ? '/uploads/' + user.profile_pic : defaultProfilePic" alt="User Profile" />
        </div>
        <div class="dropdown-menu" v-if="dropdownVisible">
          <router-link to="/profile">User Profile</router-link>
          <router-link to="/change-password">Change Password</router-link>
          <a href="#" @click.prevent="confirmLogout">Logout</a>
        </div>
        <router-link to="/cart" class="cart-icon"></router-link>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div>Learn More About Us</div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="about-item">
        <h2>Our Mission</h2>
        <img src="@/assets/images/agriculture.jpg" alt="About Image 1" />
        <p>
          At AgriEcommerce, we strive to revolutionize the agricultural sector by providing farmers and consumers with an innovative platform that connects them directly. Our mission is to facilitate access to high-quality agricultural products while promoting sustainable farming practices.
        </p>
      </div>
      <div class="about-item">
        <h2>Our Vision</h2>
        <img src="@/assets/images/ag.jpg" alt="About Image 2" />
        <p>
          We envision a world where technology and agriculture work hand-in-hand to create sustainable solutions for food production. Our goal is to empower local farmers by giving them the tools and knowledge to thrive in the digital age, ensuring a stable supply of fresh produce for everyone.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownVisible: false,
      defaultProfilePic: require('@/assets/images/default-profile.png'), // Correct path for default profile image
      user: {
        profile_pic: null // Replace with actual user data when available
      }
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
        window.location.href = '/logout';
      }
    },
    hideDropdown(event) {
      if (!event.target.closest('.user-icon') && !event.target.closest('.dropdown-menu')) {
        this.dropdownVisible = false;
      }
    }
  },
  mounted() {
    window.addEventListener('click', this.hideDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdown);
  }
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
  width: 30px; 
  height: 30px; 
  border-radius: 50%;
  margin-right: 5px; 
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
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
}

.about {
  display: flex;
  justify-content: space-between;
  padding: 40px 80px;
  background-color: #fff;
}

.about-item {
  width: 45%;
}

.about-item h2 {
  color: #2d7b3b;
  margin-bottom: 20px;
}

.about-item img {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.about-item p {
  font-size: 16px;
  line-height: 1.6;
}

.dropdown-menu {
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
</style>
