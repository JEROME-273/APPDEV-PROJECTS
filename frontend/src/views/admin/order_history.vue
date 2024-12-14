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
              <h1>Order Transaction History</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active">Order History</li>
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
                  <h3 class="card-title">Order History</h3>
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
                <div class="card-body table-responsive p-0">
                  <table class="table table-hover text-nowrap">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Total Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Order Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-if="orders && orders.length > 0"
                        v-for="order in orders"
                        :key="order.order_id">
                        <td>{{ order.order_id }}</td>
                        <td>₱{{ order.total_amount }}</td>
                        <td>{{ order.payment_method }}</td>
                        <td>
                          <span
                            :class="{
                              'badge bg-success': order.status === 'Completed',
                              'badge bg-warning': order.status === 'Pending',
                              'badge bg-danger': order.status === 'Cancelled',
                            }">
                            {{ order.status }}
                          </span>
                        </td>
                        <td>{{ order.created_at }}</td>
                        <td>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="deleteOrder(order.order_id)">
                            <i class="fas fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                      <tr v-else>
                        <td colspan="6" class="text-center">
                          No confirmed orders found
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
  name: "OrderHistory",
  data() {
    return {
      searchQuery: "",
      orders: [], // This will hold the list of orders
    };
  },
  methods: {
    confirmLogout() {
      if (confirm("Are you sure you want to log out?")) {
        this.$router.push("/login");
      }
    },
    deleteOrder(orderId) {
      if (
        confirm(
          `Are you sure you want to delete order ID ${orderId} from history?`
        )
      ) {
        // Simulate delete action; replace with actual API call
        this.orders = this.orders.filter((order) => order.order_id !== orderId);
      }
    },
    searchOrders() {
      // Implement search functionality here
      console.log(`Searching for: ${this.searchQuery}`);
      // You would typically make an API call here to search for orders
      // For now, we'll just filter the existing orders
      this.orders = this.orders.filter(
        (order) =>
          order.order_id
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          order.payment_method
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          order.status.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    fetchOrders() {
      // Replace this with an actual API call to fetch orders
      this.orders = [
        {
          order_id: "1",
          total_amount: "1000",
          payment_method: "Cash",
          status: "Completed",
          created_at: "2024-12-08",
        },
        {
          order_id: "2",
          total_amount: "1500",
          payment_method: "Credit Card",
          status: "Pending",
          created_at: "2024-12-09",
        },
        {
          order_id: "3",
          total_amount: "750",
          payment_method: "PayPal",
          status: "Cancelled",
          created_at: "2024-12-10",
        },
      ];
    },
  },
  created() {
    this.fetchOrders();
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
