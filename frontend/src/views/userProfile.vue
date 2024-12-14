<template>
  <div>
    <!-- Header Section -->
    <header class="header">
      <div class="logo">
        <img src="@/assets/images/agri_logo.jpeg" alt="AgriEcommerce Logo" />
        <h1>AgriEcommerce</h1>
      </div>
      <nav class="navbar">
        <router-link to="/welcome" class="nav-link"
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
    </header>

    <!-- Profile Container -->
    <div class="container">
      <div class="profile-info">
        <h2>User Profile</h2>
        <p><strong>Full Name:</strong> {{ user.fullname }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>

      <form @submit.prevent="saveProfile">
        <div class="profile-pic">
          <img :src="profilePicUrl" alt="Profile Picture" id="profileImage" />
          <label for="profilePic" class="file-label"
            >Upload Profile Picture</label
          >
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            @change="previewImage" />
        </div>
        <button type="submit" class="upload-btn">Save</button>
      </form>

      <!-- Message display -->
      <div v-if="successMsg" class="message success">{{ successMsg }}</div>
      <div v-if="errorMsg" class="message error">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        fullname: "User's Full Name",
        email: "user@example.com",
        profile_pic: "default-profile.png",
      },
      successMsg: "",
      errorMsg: "",
      profilePicUrl: "/uploads/default-profile.png",
    };
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicUrl = URL.createObjectURL(file);
      }
    },
    saveProfile() {
      // Handle save profile logic here
      // E.g., Send form data to backend and display success or error message
      this.successMsg = "Profile updated successfully!";
    },
  },
};
</script>

<style scoped>
/* Copy the CSS directly from your HTML file */
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

.navbar a {
  margin: 0 15px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.navbar a:hover,
.navbar a.active {
  color: #2d7b3b;
}

.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-bottom: 20px;
}

.profile-info h2 {
  color: #2d7b3b;
  margin-bottom: 10px;
}

.profile-info p {
  font-size: 18px;
  margin-bottom: 10px;
}

.profile-pic {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-pic img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
  border: 2px solid #2d7b3b;
}

.upload-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #2d7b3b;
  color: white;
  cursor: pointer;
}

.upload-btn:hover {
  background-color: #238f3b;
}

input[type="file"] {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f4f4f4;
}

.message {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
