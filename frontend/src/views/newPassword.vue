<template>
  <div>
    <h1>Set New Password</h1>
    <form @submit.prevent="submitForm">
      <input
        v-model="password"
        type="password"
        placeholder="New Password"
        required />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        required />
      <button type="submit">Update Password</button>
    </form>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green">{{ successMsg }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      confirmPassword: "",
      errorMsg: "",
      successMsg: "",
    };
  },
  methods: {
    submitForm() {
      // Simulate password reset logic (replace with actual logic)
      if (this.password !== this.confirmPassword) {
        this.errorMsg = "Passwords do not match.";
        this.successMsg = "";
      } else {
        this.successMsg = "Password successfully updated!";
        this.errorMsg = "";
        // Here you would handle the password reset logic, e.g., API call
      }
    },
  },
};
</script>

<style scoped>
/* Add any styles here */
</style>
