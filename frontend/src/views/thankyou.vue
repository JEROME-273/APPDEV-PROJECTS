<template>
  <div class="thank-you-container">
    <h1>Thank You for Your Purchase!</h1>
    <p>Your order has been successfully placed.</p>
    <p>
      We will send a confirmation to your email once your order is processed.
    </p>

    <router-link to="/shop" class="continue-shopping"
      >Continue Shopping</router-link
    >

    <p class="user-message" v-if="user">
      Thank you, <span>{{ user.fullname }}</span
      >!
    </p>
    <p class="user-message" v-else>Thank you for shopping with us!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null, // You can replace this with actual user data (e.g., from a store or API)
    };
  },
};
</script>

<style scoped>
/* Basic reset and styling */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #f4f7f6;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.thank-you-container {
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 80%;
  max-width: 500px;
}

h1 {
  color: #2d7b3b;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #555;
}

.continue-shopping {
  font-size: 1rem;
  text-decoration: none;
  color: white;
  background-color: #28a745;
  margin: 5px 15px;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: inline-block;
}

.continue-shopping:hover {
  background-color: #218838;
}

.user-message {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
}

.user-message span {
  color: #2d7b3b;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .thank-you-container {
    padding: 20px;
    width: 90%;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
