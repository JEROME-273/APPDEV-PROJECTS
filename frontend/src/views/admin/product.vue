<template>
  <div class="wrapper">
    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="/" class="brand-link">
        <img
          src="@/assets/images/agri_logo.jpeg"
          alt="Logo"
          class="brand-image img-circle elevation-3"
          style="opacity: 0.8" />
        <span class="brand-text font-weight-light">AgriAdmin</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false">
            <li class="nav-item">
              <a href="/dashboard" class="nav-link">
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/products" class="nav-link">
                <i class="nav-icon fas fa-box"></i>
                <p>Products</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/orders" class="nav-link">
                <i class="nav-icon fas fa-shopping-cart"></i>
                <p>Orders</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/cancelled_orders" class="nav-link">
                <i class="nav-icon fas fa-ban"></i>
                <p>Cancelled Orders</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/order_history" class="nav-link">
                <i class="nav-icon fas fa-history"></i>
                <p>Transaction History</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/messages" class="nav-link">
                <i class="nav-icon fas fa-comments"></i>
                <p>Messages</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/accounts" class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <p>Accounts</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="">
                <i class="nav-icon fas fa-sign-out-alt"></i>
                <p>Logout</p>
              </a>
            </li>
          </ul>
        </nav>
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1>Product List</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active">Products</li>
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
                  <h3 class="card-title">Product List</h3>
                  <div
                    class="card-tools d-flex justify-content-between flex-column flex-md-row">
                    <div
                      class="input-group input-group-sm mb-2 mb-md-0"
                      style="width: 150px">
                      <input
                        type="text"
                        name="table_search"
                        class="form-control float-right"
                        placeholder="Search"
                        v-model="searchQuery" />
                      <div class="input-group-append">
                        <button
                          type="submit"
                          class="btn btn-default"
                          @click="search">
                          <i class="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                    <router-link
                      to="/addProduct"
                      class="btn btn-success btn-sm">
                      <i class="fas fa-plus"></i> Add Product
                    </router-link>
                  </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                  <table class="table table-hover text-nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Image</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-if="products.length > 0"
                        v-for="product in products"
                        :key="product.id">
                        <td>{{ product.id }}</td>
                        <td>{{ product.product_name }}</td>
                        <td>
                          ₱{{
                            product.price ? product.price.toFixed(2) : "N/A"
                          }}
                        </td>
                        <td>{{ product.quantity }}</td>
                        <td>
                          <img
                            v-if="product.product_image"
                            :src="`http://localhost:2500/uploads/${product.product_image
                              .split('/')
                              .pop()}`"
                            :alt="product.product_name"
                            class="product-image"
                            style="max-width: 50px; max-height: 50px" />
                          <span v-else>No Image</span>
                        </td>
                        <td class="description-cell">
                          <div
                            class="description-content"
                            :title="product.description">
                            {{ product.description }}
                          </div>
                        </td>
                        <td>
                          <router-link
                            :to="`/admin/edit-product/${product.id}`"
                            class="btn btn-info btn-sm">
                            <i class="fas fa-pencil-alt"></i> Edit
                          </router-link>
                          <button
                            @click="confirmDelete(product.id)"
                            class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                      <tr v-else>
                        <td colspan="7" class="text-center">
                          No products available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
            </div>
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!-- Main Footer -->
    <footer class="main-footer">
      <strong>Copyright &copy; 2023 <a href="#">AgriEcommerce</a>.</strong>
      All rights reserved.
      <div class="float-right d-none d-sm-inline-block">
        <b>Version</b> 3.2.0
      </div>
    </footer>
  </div>
  <!-- ./wrapper -->
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      products: [], // List of products
    };
  },
  methods: {
    fetchProducts() {
      fetch("http://localhost:2500/api/admin/products")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.products)) {
            this.products = data.products;
          } else {
            console.error("Unexpected API response format:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },
    search() {
      // Implement search functionality here
      console.log("Searching for:", this.searchQuery);
    },
    confirmDelete(productId) {
      // Implement delete confirmation here
      console.log("Confirming delete for product ID:", productId);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css";

/* Custom styles */
.main-sidebar {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
}

.content-wrapper {
  margin-left: 250px;
  padding-top: 20px;
}

@media (max-width: 991.98px) {
  .content-wrapper {
    margin-left: 0;
  }
}

.nav-sidebar .nav-link p {
  display: inline;
  margin-left: 5px;
}

.product-image {
  object-fit: cover;
}

/* Responsive table styles */
.table-responsive {
  overflow-x: auto;
}

.table th,
.table td {
  white-space: nowrap;
}

.description-cell {
  max-width: 200px; /* Limit the width of the description column */
}

.description-content {
  height: 100px; /* Set a fixed height for the description content */
  overflow-y: auto; /* Enable vertical scrolling */
  white-space: normal; /* Allow text to wrap */
}

@media (max-width: 767.98px) {
  .description-cell {
    max-width: 100px;
  }
}
</style>
