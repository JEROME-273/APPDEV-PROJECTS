<template>
    <div class="container">
      <div class="login-container">
        <!-- Login Form -->
        <div class="login-form">
          <div class="logo">
            <img src="@/assets/images/agri_logo.jpeg" alt="Agri Logo" />
          </div>
          <h1 class="login-header">Login to Your Account</h1>
  
          <!-- Error Message -->
          <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
  
          <p>Login using social networks</p>
          <div class="social-login">
            <button class="social-btn facebook">f</button>
            <button class="social-btn google">G+</button>
            <button class="social-btn linkedin">in</button>
          </div>
          <div class="divider">OR</div>
  
          <!-- Form -->
          <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <div class="password-field">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
                id="passwordInput"
              />
              <span class="eye-icon" @click="togglePassword">{{ showPassword ? '🙈' : '👁' }}</span>
            </div>
            <button type="submit" class="sign-in-btn">Sign In</button>
          </form>
        </div>
  
        <!-- Sign Up Section -->
        <div class="signup-container">
          <h2>New Here?</h2>
          <p>Sign up and discover a great amount of new opportunities!</p>
          <router-link to="/signup" class="signup-btn">Sign Up</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
        errorMsg: null,
      };
    },
    methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      try {
        if (!this.email || !this.password) {
          this.errorMsg = 'Please fill in all fields';
          return;
        }

        // Make the API call to the backend at port 8080
        const response = await axios.post('http://localhost:8080//api/login', {
          email: this.email,
          password: this.password,
        }, { withCredentials: true }); // Enable cookies/sessions if needed

        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        } else {
          this.errorMsg = response.data.errorMsg || 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMsg = 'An error occurred during login. Please try again later.';
      }
    }
  }

};
  </script>
  
  <style scoped>
  /* Styles from your original CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f4f7f6;
  }
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .login-container {
    display: flex;
    width: 800px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .login-form {
    width: 50%;
    padding: 40px;
    background-color: #fff;
  }
  
  .signup-container {
    width: 50%;
    background: linear-gradient(to top right, #068b0d 0%, #25b807 100%);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 40px;
  }
  
  .signup-container h2 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  .signup-container p {
    margin-bottom: 30px;
  }
  
  .signup-btn {
    background-color: white;
    color: #2e7d32;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    text-decoration: none;
  }
  
  .signup-btn:hover {
    background-color: #f1f1f1;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
    font-weight: 700;
    color: #2e7d32;
  }
  
  p {
    color: #ffffff;
    margin-bottom: 10px;
  }
  
  .social-login {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .social-btn {
    background-color: #f5f5f5;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 18px;
  }
  
  .social-btn.facebook {
    color: #3b5998;
  }
  .social-btn.google {
    color: #dd4b39;
  }
  .social-btn.linkedin {
    color: #0077b5;
  }
  
  .divider {
    text-align: center;
    margin: 10px 0;
    color: #ccc;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  input {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    width: 100%;
  }
  
  .password-field {
    position: relative;
  }
  
  .eye-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  
  .sign-in-btn {
    background-color: #068b0d;
    color: white;
    border: none;
    padding: 15px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
  }
  
  .sign-in-btn:hover {
    background-color: #1b5e20;
  }
  
  .logo img {
    width: 50px;
    margin-bottom: 20px;
  }
  
  .login-header {
    margin-bottom: 15px;
  }
  
  .error-message {
    color: red;
    font-size: 16px;
    margin-bottom: 15px;
    text-align: center;
  }
  </style>
  