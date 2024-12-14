<template>
  <div class="container">
    <div class="login-container">
      <!-- Login Form -->
      <div class="login-form">
        <div class="logo">
          <img src="@/assets/images/agri_logo.jpeg" alt="Agri Logo" />
        </div>
        <h1 class="login-header">Login to Your Account</h1>

        <!-- Display Success and Error Messages -->
        <div v-if="successMsg" class="alert alert-success">
          {{ successMsg }}
        </div>
        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

        <form @submit.prevent="handleLogin">
          <input v-model="email" type="text" placeholder="Email" required />
          <div class="password-field">
            <input
              v-model="password"
              :type="passwordFieldType"
              placeholder="Password"
              required />
            <span class="eye-icon" @click="togglePasswordVisibility">
              {{ passwordFieldType === "password" ? "👁" : "🙈" }}
            </span>
          </div>
          <button type="submit" class="sign-in-btn">Sign In</button>
          <br />
          <a href="/resetPassword">Forgot password</a>
        </form>
      </div>

      <!-- Signup Section -->
      <div class="signup-container">
        <h2>New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities!</p>
        <a href="/signup" class="signup-btn">Sign Up</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      email: "",
      password: "",
      passwordFieldType: "password",
    };
  },
  methods: {
    async handleLogin() {
      const toast = useToast();
      try {
        if (!this.email || !this.password) {
          toast.error("Email and password are required.");
          return;
        }

        const response = await axios.post("/login", {
          email: this.email,
          password: this.password,
        });

        console.log("API Response:", response.data); // Log the response

        if (response.data.success && response.data.verified) {
          toast.success("Successfully logged in!");
          this.$store.commit("setLoginStatus", true);
          console.log("Role detected:", response.data.role);

          // Redirect based on the user's role
          try {
            if (response.data.role === "admin") {
              await this.$router.push("/dashboard");
            } else if (response.data.role === "user") {
              await this.$router.push("/welcome");
            }
          } catch (err) {
            console.error("Router push error:", err);
          }
        } else if (!response.data.verified) {
          toast.warning("Please verify your account before logging in.");
        } else {
          toast.error("Invalid email or password. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(
          error.response?.data?.errorMsg ||
            "An error occurred while logging in. Please try again."
        );
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
  },
};
</script>

<style scoped>
/* Add your existing CSS here */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Roboto", sans-serif;
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
  background: linear-gradient(to top right, #2c5f2d 0%, #25b807 100%);
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
  background-color: #2c5f2d;
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
