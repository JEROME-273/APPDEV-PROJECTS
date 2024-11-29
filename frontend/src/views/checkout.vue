<template>
  <div>
    <header class="header">
      <div class="logo">
        <img :src="logoSrc" alt="AgriEcommerce Logo" />
        <h1>AgriEcommerce</h1>
      </div>
    </header>

    <div class="form-container">
      <h2><i class="fas fa-shopping-cart"></i> Checkout</h2>
      <br /><br />
      <form @submit.prevent="submitCheckout">
        <div class="form-group">
          <label for="fullname"><i class="fas fa-user"></i> Full Name</label>
          <input type="text" id="fullname" v-model="fullname" />
        </div>
        <div class="form-group">
          <label for="address"
            ><i class="fas fa-map-marker-alt"></i> Address</label
          >
          <input type="text" id="address" v-model="address" required />
        </div>
        <div class="form-group">
          <label for="cpnumber"
            ><i class="fas fa-phone"></i> Contact Number</label
          >
          <input type="tel" id="cpnumber" v-model="cpnumber" required />
        </div>

        <h3>Order Summary</h3>
        <table class="order-summary">
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cart" :key="index">
              <td>
                <img
                  :src="'/uploads/' + item.product_image.split('/').pop()"
                  :alt="item.product_name"
                  style="width: 50px" />
              </td>
              <td>{{ item.product_name }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>

        <div class="total">Total Amount: ₱{{ totalAmount.toFixed(2) }}</div>

        <div class="payment-options">
          <h3><i class="fas fa-credit-card"></i> Select Payment Method</h3>
          <div class="payment-option">
            <input
              type="radio"
              id="cod"
              value="cash_on_delivery"
              v-model="paymentMethod" />
            <i class="fas fa-money-bill-wave"></i>
            <label for="cod">Cash on Delivery</label>
          </div>
          <div class="payment-option">
            <input
              type="radio"
              id="gcash"
              value="gcash"
              v-model="paymentMethod" />
            <i class="fab fa-gg-circle"></i>
            <label for="gcash">Pay using GCash</label>
          </div>
        </div>

        <button type="submit" class="checkout-button">
          <i class="fas fa-check"></i> Confirm Payment
        </button>
        <router-link to="/cart" class="back-button"
          ><i class="fas fa-arrow-left"></i> Back to Cart</router-link
        >
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullname: "",
      address: "",
      cpnumber: "",
      paymentMethod: "cash_on_delivery",
      cart: [
        // Sample cart data
        { product_name: "Tomato", product_image: "tomato.jpg", quantity: 2 },
        { product_name: "Cabbage", product_image: "cabbage.jpg", quantity: 1 },
      ],
      totalAmount: 150.0,
      logoSrc: "@/assets/images/agri_logo.jpeg",
    };
  },
  methods: {
    submitCheckout() {
      const orderDetails = {
        fullname: this.fullname,
        address: this.address,
        cpnumber: this.cpnumber,
        paymentMethod: this.paymentMethod,
        cart: this.cart,
      };

      // Handle the form submission logic (e.g., make an API request to confirm the checkout)
      console.log("Order Details:", orderDetails);
    },
  },
};
</script>

<style scoped>
/* Existing styles, you can keep the same or adjust according to Vue structure */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #f4f4f4;
}

.header .logo {
  display: flex;
  align-items: center;
}

.header .logo img {
  width: 50px;
  height: auto;
  margin-right: 10px;
}

.header .logo h1 {
  font-size: 24px;
  color: #2d7b3b;
}

.form-container {
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.order-summary {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

.order-summary th,
.order-summary td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.order-summary th {
  background-color: #f4f4f4;
}

.total {
  font-weight: bold;
  text-align: right;
  padding: 10px;
}

.checkout-button,
.back-button {
  display: block;
  width: 200px;
  margin: 20px auto;
  background-color: #2d7b3b;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
}

.checkout-button:hover,
.back-button:hover {
  background-color: #25612c;
}

.payment-options {
  margin-top: 20px;
}

.payment-option {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.payment-option i {
  margin-right: 10px;
  font-size: 20px;
}

.back-button {
  background-color: #d9534f;
}
</style>
