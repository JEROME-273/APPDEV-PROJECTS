<template>
    <div class="container">
      <div class="signup-container">
        <!-- Sign Up Form -->
        <div class="signup-form">
          <div class="logo">
            <img src="/images/agri_logo.jpeg" alt="Diprella Logo" />
          </div>
          <h1 class="signup-header">Create Your Account</h1>
  
          <p>Sign up using social networks</p>
          <div class="social-login">
            <button class="social-btn facebook">f</button>
            <button class="social-btn google">G+</button>
            <button class="social-btn linkedin">in</button>
          </div>
          <div class="divider">OR</div>
  
          <!-- Form -->
          <form @submit.prevent="handleSignUp">
            <input v-model="fullname" type="text" name="fullname" placeholder="Full Name" required />
            <input v-model="email" type="email" name="email" placeholder="Email" required />
  
            <div class="password-field">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                placeholder="Password"
                required
              />
              <span class="eye-icon" @click="togglePassword">{{ showPassword ? '🙈' : '👁' }}</span>
            </div>
  
            <select v-model="role" required>
              <option value="" disabled>Select your role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            
            <button type="submit" class="sign-up-btn">Sign Up</button>
          </form>
        </div>
  
        <!-- Login Section -->
        <div class="login-container">
          <h2>Already Have an Account?</h2>
          <p>Log in to continue exploring more features!</p>
          <router-link to="/login">
            <button class="login-btn">Log In</button>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        fullname: '',
        email: '',
        password: '',
        role: '',
        showPassword: false,
      };
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      handleSignUp() {
        // Here you would typically call an API endpoint
        console.log("Full Name:", this.fullname);
        console.log("Email:", this.email);
        console.log("Password:", this.password);
        console.log("Role:", this.role);
        // Reset form fields if needed
      },
    },
  };
  </script>
  
  <style scoped>
  /* Insert the same CSS from your HTML file */
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
  
  .signup-container {
    display: flex;
    width: 800px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .signup-form {
    width: 50%;
    padding: 40px;
    background-color: #fff;
  }
  
  .login-container {
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
  
  .login-container h2 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  .login-container p {
    margin-bottom: 30px;
  }
  
  .login-btn {
    background-color: white;
    color: #068b0d;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
  }
  
  .login-btn:hover {
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
  
  input,
  select {
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
  
  .sign-up-btn {
    background-color: #068b0d;
    color: white;
    border: none;
    padding: 15px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
  }
  
  .sign-up-btn:hover {
    background-color: #1b5e20;
  }
  
  .logo img {
    width: 50px;
    margin-bottom: 20px;
  }
  
  .signup-header {
    margin-bottom: 15px;
  }
  </style>
  