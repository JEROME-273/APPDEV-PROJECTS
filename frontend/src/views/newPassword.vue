<template>
  <div class="new-password">
    <header class="header">
      <h1>Set New Password</h1>
    </header>
    <div class="content">
      <p>Please enter and confirm your new password below.</p>
      <form @submit.prevent="submitForm">
        <input
          v-model="password"
          type="password"
          placeholder="Enter new password"
          class="input"
          required
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          class="input"
          required
        />
        <div class="actions">
          <button type="submit" class="btn save">Save Password</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";

export default {
  props: ["token"], // Accept token as a prop
  data() {
    return {
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async submitForm() {
      const toast = useToast();

      if (this.password !== this.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        const response = await axios.post(`/reset-password/${this.token}`, {
          password: this.password,
          confirmPassword: this.confirmPassword,
        });

        if (response.data.successMsg) {
          toast.success(response.data.successMsg);
          this.$router.push("/login");
        } else {
          toast.error(response.data.errorMsg || "An error occurred.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.errorMsg || "Failed to update the password."
        );
      }
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

.new-password {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}

.header {
  background-color: #2c5f2d;
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
  color: #2e7d32;
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
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
}

.save {
  background-color: #2c5f2d;
  color: white;
}

.save:hover {
  background-color: #1b5e20;
}
</style>
