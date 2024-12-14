<template>
  <div class="find-account">
    <header class="header">
      <h1>Reset Password</h1>
    </header>
    <div class="content">
      <h2>Find your account</h2>
      <p>
        Please enter your email or mobile number to search for your account.
      </p>
      <form @submit.prevent="searchAccount">
        <input
          v-model="accountInput"
          type="text"
          placeholder="Enter your email"
          class="input"
          required />
        <div class="actions">
          <button type="button" @click="cancel" class="btn cancel">
            Cancel
          </button>
          <button type="submit" class="btn search">Search</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
  data() {
    return {
      accountInput: "",
    };
  },
  methods: {
    async searchAccount() {
      const toast = useToast();

      if (this.accountInput.trim() === "") {
        toast.error("Please enter a valid email.");
        return;
      }

      try {
        const response = await axios.post("/reset-password", {
          email: this.accountInput,
        });

        console.log("Full response:", response); // Add this to see full response

        if (response.data.successMsg) {
          toast.success(response.data.successMsg);
          this.accountInput = "";
        } else {
          // Add more detailed logging
          console.error("Unexpected response:", response.data);
          toast.error(response.data.errorMsg || "Something went wrong.");
        }
      } catch (error) {
        console.error("Complete error object:", error);

        // More detailed error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          toast.error(
            error.response.data.errorMsg ||
              error.response.data.message ||
              "Failed to send reset email."
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          toast.error("No response from server. Please try again.");
        } else {
          // Something happened in setting up the request
          console.error("Error setting up request:", error.message);
          toast.error("An unexpected error occurred.");
        }
      }
    },
    cancel() {
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>

<style scoped>
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Roboto", sans-serif;
  background-color: #f4f7f6;
}

.find-account {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}

.header {
  background-color: #2c5f2d; /* Updated to match login page */
  color: white;
  padding: 10px;
}

.content {
  margin: 20px auto;
  max-width: 400px;
  text-align: left;
}

h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 700;
  color: #2e7d32; /* Match login page color */
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #2e7d32; /* Match login page color */
}

p {
  margin-bottom: 20px;
  color: #333;
}

.input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
}

.cancel {
  background-color: #e4e6eb; /* Light gray */
  color: #333;
}

.search {
  background-color: #2c5f2d; /* Match login page button */
  color: white;
}

.search:hover {
  background-color: #1b5e20; /* Darker green for hover effect */
}
</style>
