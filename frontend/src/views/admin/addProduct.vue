<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-md-6 col-12">
            <h1 class="mb-2">Add New Product</h1>
          </div>
          <div class="col-md-6 col-12">
            <ol class="breadcrumb float-md-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Products</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                Add New Product
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10 col-12">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h3 class="card-title">Add New Product Details</h3>
              </div>
              <div class="card-body">
                <div v-if="errors.length" class="alert alert-danger">
                  <p v-for="(error, index) in errors" :key="index">
                    {{ error }}
                  </p>
                </div>
                <div v-if="success" class="alert alert-success">
                  {{ success }}
                </div>
                <form @submit.prevent="submitForm">
                  <div class="form-group">
                    <label for="product_name">Product Name:</label>
                    <input
                      type="text"
                      id="product_name"
                      v-model="form.product_name"
                      required
                      class="form-control"
                      placeholder="Enter product name" />
                  </div>
                  <div class="form-group">
                    <label for="price">Price:</label>
                    <input
                      type="number"
                      id="price"
                      v-model="form.price"
                      step="0.01"
                      required
                      class="form-control"
                      placeholder="Enter price" />
                  </div>
                  <div class="form-group">
                    <label for="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      v-model="form.quantity"
                      required
                      class="form-control"
                      placeholder="Enter quantity" />
                  </div>
                  <div class="form-group">
                    <label for="product_image">Product Image:</label>
                    <div class="input-group">
                      <div class="custom-file">
                        <input
                          type="file"
                          class="custom-file-input"
                          id="product_image"
                          @change="handleFileUpload"
                          accept="image/*" />
                        <label class="custom-file-label" for="product_image">
                          Choose file
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="description">Product Description:</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="4"
                      required
                      class="form-control"
                      placeholder="Enter product description"></textarea>
                  </div>
                  <div class="form-group d-flex justify-content-between">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="goBack">
                      Back
                    </button>
                    <button type="submit" class="btn btn-primary">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      form: {
        product_name: "",
        price: "",
        quantity: "",
        description: "",
        product_image: null,
      },
      errors: [],
      success: "",
    };
  },
  methods: {
    // Handle file upload for product image
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.form.product_image = file;
      // Update the file input label with the selected file name
      event.target.nextElementSibling.innerText = file.name;
    },

    // Go back to the product list page
    goBack() {
      this.$router.push("/products"); // Navigate to the product list page
    },

    // Handle form submission
    async submitForm() {
      this.errors = [];
      this.success = "";

      const toast = useToast(); // Instantiate the toast

      try {
        const formData = new FormData();
        formData.append("product_name", this.form.product_name);
        formData.append("price", this.form.price);
        formData.append("quantity", this.form.quantity);
        formData.append("description", this.form.description);
        if (this.form.product_image) {
          formData.append("product_image", this.form.product_image);
        }

        const response = await axios.post("/admin/add-product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.success = "Product added successfully!";
        toast.success(this.success); // Display success toast notification

        // Reset form data after successful submission
        this.form = {
          product_name: "",
          price: "",
          quantity: "",
          description: "",
          product_image: null,
        };
        this.$router.push("/products");
      } catch (error) {
        console.error("Error adding product:", error);
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          this.errors = ["An error occurred while submitting the form."];
        }

        toast.error("An error occurred while submitting the form."); // Display error toast notification
      }
    },
  },
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css";

.card {
  border-radius: 8px;
}

.card-header {
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

@media (max-width: 991.98px) {
  .content-wrapper {
    margin-left: 0 !important;
  }

  .breadcrumb {
    justify-content: center;
  }
}

.custom-file-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
