<template>
  <div class="wrapper">
    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="/" class="brand-link">
        <img
          src="/images/agri_logo.jpeg"
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
              <h1>Cancelled Orders</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active">Cancelled Orders</li>
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
                  <h3 class="card-title">Cancelled Orders List</h3>
                  <div class="card-tools">
                    <div
                      class="input-group input-group-sm"
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
                          @click="searchOrders">
                          <i class="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                  <div class="mb-3">
                    <button
                      @click="clearCancelledOrders"
                      class="btn btn-danger">
                      Clear All
                    </button>
                  </div>
                  <div
                    v-if="successMessage"
                    class="alert alert-success"
                    id="success-message">
                    {{ successMessage }}
                  </div>
                  <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product Names and Quantities</th>
                          <th>User ID</th>
                          <th>Address</th>
                          <th>Contact Number</th>
                          <th>Payment Method</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="cancelledOrders.length === 0">
                          <td colspan="10" class="text-center">
                            No cancelled orders
                          </td>
                        </tr>
                        <tr
                          v-for="order in cancelledOrders"
                          :key="order.order_id">
                          <td>{{ order.order_id }}</td>
                          <td>
                            <p
                              v-for="item in order.items"
                              :key="item.product_name">
                              {{ item.product_name }} (x{{ item.quantity }})
                            </p>
                          </td>
                          <td>{{ order.user_id }}</td>
                          <td>{{ order.address }}</td>
                          <td>{{ order.contact_number }}</td>
                          <td>{{ order.payment_method }}</td>
                          <td>₱{{ order.total_amount }}</td>
                          <td>
                            <span class="badge bg-danger">{{
                              order.status
                            }}</span>
                          </td>
                          <td>{{ order.created_at }}</td>
                          <td>
                            <button
                              @click="deleteOrder(order.order_id)"
                              class="btn btn-sm btn-danger">
                              <i class="fas fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
      cancelledOrders: [],
      successMessage: null,
    };
  },
  methods: {
    fetchCancelledOrders() {
      // Replace with API call to get cancelled orders
      this.cancelledOrders = [
        {
          order_id: 1,
          items: [
            { product_name: "Rice", quantity: 2 },
            { product_name: "Corn", quantity: 3 },
          ],
          user_id: "U123",
          address: "123 Agri Street",
          contact_number: "09123456789",
          payment_method: "Cash",
          total_amount: 500,
          status: "Cancelled",
          created_at: "2024-12-01",
        },
      ];
    },
    confirmLogout() {
      if (confirm("Are you sure you want to log out?")) {
        // Redirect to login
        window.location.href = "/login";
      }
    },
    clearCancelledOrders() {
      if (confirm("Are you sure you want to clear all cancelled orders?")) {
        // Replace with API call to clear orders
        this.cancelledOrders = [];
        this.successMessage = "All cancelled orders cleared successfully!";
        this.autoHideSuccessMessage();
      }
    },
    deleteOrder(orderId) {
      if (confirm("Are you sure you want to delete this order?")) {
        // Replace with API call to delete order
        this.cancelledOrders = this.cancelledOrders.filter(
          (order) => order.order_id !== orderId
        );
        this.successMessage = `Order ${orderId} deleted successfully!`;
        this.autoHideSuccessMessage();
      }
    },
    autoHideSuccessMessage() {
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    },
    searchOrders() {
      // Implement search logic based on `searchQuery`
      alert(`Searching for: ${this.searchQuery}`);
    },
  },
  mounted() {
    this.fetchCancelledOrders();
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
}

.content-wrapper {
  margin-left: 250px;
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
</style>
