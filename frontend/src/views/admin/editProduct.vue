<template>
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Edit Product</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Products</a></li>
              <li class="breadcrumb-item active">Edit Product</li>
            </ol>
          </div>
        </div>
      </div>
      <!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Edit Product Details</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <!-- Display errors -->
                <div v-if="errors.length" class="alert alert-danger">
                  <p v-for="(error, index) in errors" :key="index">
                    {{ error }}
                  </p>
                </div>
                <!-- Display success message -->
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
                      class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="price">Price:</label>
                    <input
                      type="number"
                      id="price"
                      v-model="form.price"
                      step="0.01"
                      required
                      class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      v-model="form.quantity"
                      required
                      class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      required
                      class="form-control"
                      rows="3"></textarea>
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
                        <label class="custom-file-label" for="product_image"
                          >Choose file</label
                        >
                      </div>
                    </div>
                  </div>
                  <div v-if="form.product_image" class="form-group">
                    <label>Current Image:</label>
                    <div>
                      <img
                        :src="currentImage"
                        :alt="form.product_name"
                        class="img-thumbnail"
                        style="max-width: 200px; max-height: 200px" />
                    </div>
                  </div>
                  <div class="form-group">
                    <button
                      type="button"
                      class="btn btn-secondary mr-2"
                      @click="goBack">
                      Back
                    </button>
                    <button type="submit" class="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        product_name: this.product.product_name,
        price: this.product.price,
        quantity: this.product.quantity,
        description: this.product.description,
        product_image: this.product.product_image || null,
      },
      errors: [],
      success: null,
      newImage: null, // To store the selected file
    };
  },
  computed: {
    currentImage() {
      // Dynamically generate the image path
      return `/uploads/${this.form.product_image?.split("/").pop()}`;
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newImage = file; // Store the file
        // Update the file input label with the selected file name
        event.target.nextElementSibling.innerText = file.name;
      }
    },
    submitForm() {
      const formData = new FormData();
      formData.append("product_name", this.form.product_name);
      formData.append("price", this.form.price);
      formData.append("quantity", this.form.quantity);
      formData.append("description", this.form.description);

      if (this.newImage) {
        formData.append("product_image", this.newImage);
      }

      // Simulating API call
      fetch(`/admin/edit-product/${this.product.id}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save changes");
          }
          return response.json();
        })
        .then((data) => {
          this.success = "Product updated successfully!";
          this.errors = [];
        })
        .catch((error) => {
          this.errors = [error.message];
          this.success = null;
        });
    },
    goBack() {
      // Redirect to products page
      this.$router.push("/admin/products");
    },
  },
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css";

/* Custom styles */
.content-wrapper {
  margin-left: 250px;
}

@media (max-width: 991.98px) {
  .content-wrapper {
    margin-left: 0;
  }
}
</style>
