<template>
  <div>
    <h1>Email Verification</h1>
    <p v-if="isVerified">Your email has been verified. You can now log in!</p>
    <p v-else>Verification failed. Please try again.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isVerified: false,
    };
  },
  created() {
    this.verifyEmail();
  },
  methods: {
    async verifyEmail() {
      const token = this.$route.query.token; // Get the token from URL
      try {
        const response = await axios.get(`/verify-email?token=${token}`);
        if (response.data.successMsg) {
          this.isVerified = true;
        }
      } catch (error) {
        console.error("Verification failed:", error);
      }
    },
  },
};
</script>
