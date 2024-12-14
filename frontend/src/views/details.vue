<template>
  <div>
    <!-- Header -->
    <header class="header">
      <img src="/images/agri_logo.jpeg" alt="AgriEcommerce Logo" />
      <h1>AgriCommerce</h1>
    </header>

    <div class="container">
      <!-- Product Details Section -->
      <section class="product-details">
        <div class="product-image">
          <img :src="productImage" :alt="product.product_name" />
        </div>
        <div class="product-info">
          <h1>{{ product.product_name }}</h1>
          <p><strong>Price:</strong> ₱{{ formattedPrice }}</p>
          <p><strong>Description:</strong> {{ product.description }}</p>
          <p><strong>Stock:</strong> {{ product.quantity }} available</p>
          <button class="add-to-cart" @click="addToCart(product.id)">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="close-btn" @click="goToShop">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </section>
    </div>

    <!-- Alert Message -->
    <div id="cartAlert" class="alert" v-if="alertMessage">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductDetails",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alertMessage: "",
    };
  },
  computed: {
    formattedPrice() {
      return typeof this.product.price === "number"
        ? this.product.price.toFixed(2)
        : "N/A";
    },
    productImage() {
      return `/uploads/${this.product.product_image.split("/").pop()}`;
    },
  },
  methods: {
    addToCart(productId) {
      if (confirm("Are you sure you want to add this item to the cart?")) {
        axios
          .post("/cart/add", { productId })
          .then((response) => {
            this.alertMessage = response.data.message;
            setTimeout(() => {
              this.alertMessage = "";
            }, 3000);
          })
          .catch((error) => {
            this.alertMessage =
              error.response?.data?.message || "An unexpected error occurred";
            setTimeout(() => {
              this.alertMessage = "";
            }, 3000);
          });
      }
    },
    goToShop() {
      this.$router.push("/shop"); // Ensure Vue Router is configured in your app
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f6f9;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #2c3e50;
  padding: 20px;
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

header img {
  max-width: 100px;
  height: auto;
  border-radius: 50%;
  margin-right: 20px;
}

.product-details {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
  padding-left: 20px;
}

.product-info h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.product-info p {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
}

.product-info p strong {
  color: #2c3e50;
}

.add-to-cart,
.close-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart {
  background-color: #27ae60;
  color: #fff;
}

.add-to-cart:hover {
  background-color: #2ecc71;
}

.close-btn {
  background-color: #e74c3c;
  color: #fff;
  margin-top: 20px;
}

.close-btn:hover {
  background-color: #c0392b;
}

.close-btn i {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .product-details {
    flex-direction: column;
  }

  .product-image {
    margin-bottom: 20px;
  }

  .product-info {
    padding-left: 0;
  }
}

.alert {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-color: #2d7b3b;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
</style>
