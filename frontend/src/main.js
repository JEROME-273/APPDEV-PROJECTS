import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import axios from "axios";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import store from "./store";

// Import AdminLTE CSS
import "admin-lte/dist/css/adminlte.min.css";

// Import Bootstrap and jQuery from installed packages
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js"; // AdminLTE JS (after jQuery and Bootstrap)

// Set Axios base URL
axios.defaults.baseURL = "http://localhost:2500/api";
axios.defaults.withCredentials = true;

// Toastification options
const toastOptions = {
  position: "top-right",
  timeout: 3000, // Duration in milliseconds
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

// Create and mount Vue app with Toastification plugin
createApp(App)
  .use(router)
  .use(store)
  .use(Toast, toastOptions) // Add Vue Toastification plugin
  .mount("#app");
