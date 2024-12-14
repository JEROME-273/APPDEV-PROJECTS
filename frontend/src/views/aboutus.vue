<template>
  <div>
    <!-- Header Section -->
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
          At AgriEcommerce, we strive to revolutionize the agricultural sector
          by providing farmers and consumers with an innovative platform that
          connects them directly. Our mission is to facilitate access to
          high-quality agricultural products while promoting sustainable farming
          practices.
        </p>
      </div>
      <div class="about-item">
        <h2>Our Vision</h2>
        <img src="@/assets/images/ag.jpg" alt="About Image 2" />
        <p>
          We envision a world where technology and agriculture work hand-in-hand
          to create sustainable solutions for food production. Our goal is to
          empower local farmers by giving them the tools and knowledge to thrive
          in the digital age, ensuring a stable supply of fresh produce for
          everyone.
        </p>
      </div>
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
      user: {
        profile_pic: null, // Replace with actual user data
      },
      dropdownVisible: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    confirmLogout() {
      const confirmation = confirm("Are you sure you want to log out?");
      if (confirmation) {
        window.location.href = "/login";
      }
    },
    search() {
      console.log(`Searching for: ${this.searchQuery}`);
    },
  },
  watch: {
    // Automatically hide the dropdown if a click occurs outside of it
    $route(to, from) {
      this.dropdownVisible = false;
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
  background: url("@/assets/images/about.jpg") center/cover no-repeat;
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
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.dropdown-menu.show {
  display: block;
  opacity: 1;
  visibility: visible;
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

/* Responsive styles */
@media (max-width: 1024px) {
  .about {
    padding: 40px;
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
  }

  .navbar a {
    margin: 5px 10px 5px 0;
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

  .about {
    flex-direction: column;
    padding: 20px;
  }

  .about-item {
    width: 100%;
    margin-bottom: 30px;
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

  .about-item h2 {
    font-size: 20px;
  }

  .about-item p {
    font-size: 14px;
  }

  .dropdown-menu {
    width: 120px;
  }

  .dropdown-menu a {
    font-size: 12px;
  }
}
</style>
