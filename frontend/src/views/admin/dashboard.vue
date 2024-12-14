<template>
  <div class="wrapper">
    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="/dashboard" class="brand-link">
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
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">Dashboard</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">
          <!-- Info boxes -->
          <div class="row">
            <div
              class="col-12 col-sm-6 col-md-3"
              v-for="(value, key) in stats"
              :key="key">
              <div class="info-box">
                <span class="info-box-icon bg-info elevation-1"
                  ><i class="fas fa-chart-bar"></i
                ></span>
                <div class="info-box-content">
                  <span class="info-box-text">{{ key }}</span>
                  <span class="info-box-number">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- /.row -->

          <div class="row">
            <div class="col-md-6">
              <!-- AREA CHART -->
              <div class="card card-primary">
                <div class="card-header">
                  <h3 class="card-title">Recent Orders</h3>
                </div>
                <div class="card-body">
                  <div class="chart">
                    <canvas
                      id="recentOrdersChart"
                      style="
                        min-height: 250px;
                        height: 250px;
                        max-height: 250px;
                        max-width: 100%;
                      "></canvas>
                  </div>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
            </div>
            <!-- /.col (LEFT) -->
            <div class="col-md-6">
              <!-- BAR CHART -->
              <div class="card card-success">
                <div class="card-header">
                  <h3 class="card-title">Total Sales</h3>
                </div>
                <div class="card-body">
                  <div class="chart">
                    <canvas
                      id="totalSalesChart"
                      style="
                        min-height: 250px;
                        height: 250px;
                        max-height: 250px;
                        max-width: 100%;
                      "></canvas>
                  </div>
                </div>
                <!-- /.card-body -->
              </div>
              <!-- /.card -->
            </div>
            <!-- /.col (RIGHT) -->
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

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const searchQuery = ref("");
const stats = ref({
  "Total Sales": "30,500",
  "Total Accounts": "37,150",
  "Orders Paid": "30,500",
  "Pending Orders": "19,000",
});

const confirmLogout = () => {
  if (confirm("Are you sure you want to log out?")) {
    window.location.href = "/login"; // Redirect to logout route
  }
};

const search = () => {
  console.log("Search query:", searchQuery.value);
};

onMounted(() => {
  // Create line chart for recent orders
  const recentOrdersCtx = document
    .getElementById("recentOrdersChart")
    .getContext("2d");
  new Chart(recentOrdersCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Orders",
          data: [12, 19, 3, 5, 2, 3],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Create bar chart for total sales
  const totalSalesCtx = document
    .getElementById("totalSalesChart")
    .getContext("2d");
  new Chart(totalSalesCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Sales",
          data: [50, 40, 60, 70, 50, 80],
          backgroundColor: "rgb(75, 192, 192)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});
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
