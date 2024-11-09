<template>
    <div>
      <!-- Header Section -->
      <header class="header">
        <div class="logo">
          <img :src="agriLogo" alt="AgriEcommerce Logo" />
          <h1>AgriEcommerce</h1>
        </div>
        <nav class="navbar">
          <router-link to="/welcome" class="nav-link">
            <i class="fas fa-home"></i>Home
          </router-link>
          <router-link to="/shop" class="nav-link">
            <i class="fas fa-shopping-cart"></i>Shop
          </router-link>
          <router-link to="/aboutus" class="nav-link">
            <i class="fas fa-info-circle"></i>About Us
          </router-link>
          <router-link to="/news" class="nav-link">
            <i class="fas fa-newspaper"></i>News
          </router-link>
          <router-link to="/contact" class="nav-link active">
            <i class="fas fa-envelope"></i>Contact
          </router-link>
          <div class="search-bar">
            <input type="text" placeholder="Search..." />
            <button type="submit"><i class="fas fa-search"></i></button>
          </div>
          <div class="user-icon" @click="toggleDropdown">
            <img :src="userImage" alt="User Profile" class="profile-pic" />
          </div>
          <div class="dropdown-menu" :class="{ show: dropdownVisible }">
            <router-link to="/profile">User Profile</router-link>
            <router-link to="/change-password">Change Password</router-link>
            <a href="#" @click.prevent="confirmLogout">Logout</a>
          </div>
          <router-link to="/cart"><i class="fas fa-shopping-cart"></i></router-link>
        </nav>
      </header>
  
      <!-- Contact Container -->
      <div class="contact-container">
        <!-- Form Section -->
        <div class="form-section">
          <h2>Send Us a Message</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Full Name:</label>
              <input type="text" id="name" v-model="form.name" required />
            </div>
            <div class="form-group">
              <label for="email">E-mail:</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone Number:</label>
              <input type="tel" id="phone" v-model="form.phone" placeholder="+6399-9999-999" required />
            </div>
            <div class="form-group">
              <label for="message">Message:</label>
              <textarea id="message" v-model="form.message" required></textarea>
            </div>
            <button type="submit" class="submit-btn">
              <i class="fas fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
  
        <!-- Information Section -->
        <div class="info-section">
          <h2>Contact Information</h2>
          <p><i class="fas fa-map-marker-alt"></i>Masipit, Calapan City, Oriental Mindoro</p>
          <p><i class="fas fa-envelope"></i> AgriEcommerce@gmail.com</p>
          <p><i class="fas fa-phone"></i> 0998-263-340</p>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook-square"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        agriLogo: require('@/assets/images/agri_logo.jpeg'), // Path to your logo
        dropdownVisible: false,
        form: {
          name: '',
          email: '',
          phone: '',
          message: ''
        },
        user: {
          profile_pic: null // Replace with your logic to get the user profile picture
        }
      };
    },
    computed: {
      userImage() {
        return this.user.profile_pic
          ? `/uploads/${this.user.profile_pic}`
          : require('@/assets/images/default-profile.png'); // Default profile picture
      }
    },
    methods: {
      toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
      },
      submitForm() {
        // Handle form submission logic here
        console.log('Form submitted:', this.form);
        // Reset form fields after submission
        this.form = { name: '', email: '', phone: '', message: '' };
      },
      confirmLogout() {
        if (confirm('Are you sure you want to logout?')) {
          window.location.href = '/logout'; // Replace with your logout logic
        }
      }
    },
    mounted() {
      window.onclick = (event) => {
        if (!event.target.matches('.user-icon') && !event.target.closest('.dropdown-menu')) {
          this.dropdownVisible = false;
        }
      };
    }
  };
  </script>
  
  <style scoped>
  /* Include your styles here */
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    color: #333;
    background-color: #f4f4f4;
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
    align-items: center;
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
  
  .search-bar {
    margin: 0 15px;
    position: relative;
  }
  
  .search-bar input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: 200px;
  }
  
  .search-bar button {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #2d7b3b;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .search-bar button:hover {
    background-color: #25612c;
  }
  
  .contact-container {
    display: flex;
    justify-content: space-around;
    padding: 40px;
    background-color: #fff;
  }
  
  .form-section,
  .info-section {
    width: 45%;
    padding: 20px;
    border-radius: 8px;
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-section h2,
  .info-section h2 {
    color: #2d7b3b;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .form-group textarea {
    resize: vertical;
    height: 100px;
  }
  
  .submit-btn {
    display: inline-block;
    background-color: #2d7b3b;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .submit-btn:hover {
    background-color: #25612c;
  }
  
  .info-section p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .info-section i {
    color: #2d7b3b;
    margin-right: 10px;
  }
  
  .social-icons {
    display: flex;
    margin-top: 15px;
  }
  
  .social-icons a {
    margin-right: 10px;
    color: #2d7b3b;
    font-size: 20px;
    text-decoration: none;
  }
  
  .user-icon {
    cursor: pointer;
    position: relative;
  }
  
  .profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .dropdown-menu {
    display: none;
    position: absolute;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    right: 0;
  }
  
  .dropdown-menu.show {
    display: block;
  }
  
  .dropdown-menu a {
    display: block;
    padding: 10px;
    color: #333;
    text-decoration: none;
  }
  
  .dropdown-menu a:hover {
    background-color: #f4f4f4;
  }
  </style>
  