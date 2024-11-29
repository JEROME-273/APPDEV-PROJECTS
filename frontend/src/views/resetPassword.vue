<template>
  <div>
    <h1>Reset Password</h1>
    <form @submit.prevent="resetPassword">
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        required />
      <button type="submit">Reset Password</button>
    </form>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green">{{ successMsg }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      errorMsg: "",
      successMsg: "",
    };
  },
  methods: {
    resetPassword() {
      // Simulate the password reset process (replace with your logic)
      if (this.email === "") {
        this.errorMsg = "Please enter a valid email.";
        this.successMsg = "";
      } else {
        this.successMsg = "Password reset link sent to your email!";
        this.errorMsg = "";
        // Here you would handle the reset password logic, e.g., API call
      }
    },
  },
};
</script>

<style scoped>
/* Add any styles here */
</style>
