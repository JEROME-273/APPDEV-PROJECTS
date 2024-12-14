<template>
  <div class="container">
    <div class="signup-container">
      <div class="signup-form">
        <div class="logo">
          <img src="@/assets/images/agri_logo.jpeg" alt="Diprella Logo" />
        </div>
        <h1 class="signup-header">Create Your Account</h1>

        <form @submit.prevent="submitForm">
          <input
            type="text"
            v-model="form.fullname"
            placeholder="Full Name"
            required />
          <input
            type="email"
            v-model="form.email"
            placeholder="Email"
            required />
          <div class="password-field">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="Password"
              required />
            <span class="eye-icon" @click="togglePassword">
              {{ showPassword ? "🙈" : "👁" }}
            </span>
          </div>
          <!-- Disable button during submission -->
          <button type="submit" class="sign-up-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">Signing Up...</span>
            <span v-else>Sign Up</span>
          </button>
        </form>
      </div>
      <!-- Login Section -->
      <div class="login-container">
        <h2>Already Have an Account?</h2>
        <p>Log in to continue exploring more features!</p>
        <router-link to="/login">
          <button class="login-btn" @click="gotoLogin">Log In</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css"; // Import styles

export default {
  data() {
    return {
      form: {
        fullname: "",
        email: "",
        password: "",
      },
      showPassword: false,
      isSubmitting: false,
    };
  },
  methods: {
    // Method to handle the form submission
    async submitForm() {
      this.isSubmitting = true;
      const toast = useToast(); // Access the toast instance

      try {
        if (!this.form.fullname || !this.form.email || !this.form.password) {
          toast.error("All fields are required.");
          return;
        }

        const response = await axios.post("/signup", this.form);

        if (response.data.success) {
          toast.success(
            response.data.successMsg || "Account created successfully!"
          );
          this.form = { fullname: "", email: "", password: "" };

          // Redirect to login after a brief success message display
          setTimeout(() => {
            this.$router.push("/login");
          }, 1500);
        } else {
          toast.error(
            response.data.errorMsg || "An error occurred. Please try again."
          );
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error(
          "A server error occurred. Please check your connection and try again."
        );
      } finally {
        this.isSubmitting = false;
      }
    },

    // Toggle password visibility
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    // Method to navigate to login page
    gotoLogin() {
      this.$router.push("/login");
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
  font-family: "Roboto", sans-serif;
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
  background: linear-gradient(to top right, #2c5f2d 0%, #25b807 100%);
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
  background-color: #2c5f2d;
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

.alert {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.alert-success {
  background-color: #dff0d8;
  color: #3c763d;
}

.alert-danger {
  background-color: #f2dede;
  color: #a94442;
}
</style>
