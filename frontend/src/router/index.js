import { createRouter, createWebHistory } from "vue-router";
import aboutus from "../views/aboutus.vue";
import contact from "../views/contact.vue";
import login from "../views/login.vue";
import signup from "../views/signup.vue";
import userProfile from "../views/userProfile.vue";
import welcome from "../views/welcome.vue";
import cart from "@/views/cart.vue";
import checkout from "@/views/checkout.vue";
import newPassword from "@/views/newPassword.vue";
import resetPassword from "@/views/resetPassword.vue";
import thankyou from "@/views/thankyou.vue";
import shop from "@/views/shop.vue";
import details from "@/views/details.vue";
import VerifyEmail from "@/views/VerifyEmail.vue";
import store from "../store";
import dashboard from "@/views/admin/dashboard.vue";
import product from "@/views/admin/product.vue";
import orders from "@/views/admin/orders.vue";
import cancelled_orders from "@/views/admin/cancelled_orders.vue";
import order_history from "@/views/admin/order_history.vue";
import editProduct from "@/views/admin/editProduct.vue";
import addProduct from "@/views/admin/addProduct.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: login,
    beforeEnter: (to, from, next) => {
      // console.log("Login route guard - isLoggedIn:", store.state.isLoggedIn);
      if (store.state.isLoggedIn) {
        // console.log("Redirecting to welcome");
        next("/welcome");
      } else {
        next();
      }
    },
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: VerifyEmail,
    props: (route) => ({ token: route.query.token }),
  },
  {
    path: "/aboutus",
    name: "aboutus",
    component: aboutus, // About Us view
  },
  {
    path: "/contact", // Added leading slash
    name: "contact",
    component: contact, // Contact view
  },
  {
    path: "/signup", // Added leading slash
    name: "signup",
    component: signup, // Signup view
  },
  {
    path: "/userProfile", // Added leading slash
    name: "userProfile",
    component: userProfile, // User Profile view
  },
  {
    path: "/welcome", // Added leading slash
    name: "welcome",
    component: welcome, // Welcome view
  },
  {
    path: "/cart",
    name: "cart",
    component: cart,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: checkout,
  },
  {
    path: "/reset-password/:token",
    name: "newPassword",
    component: newPassword,
    props: true,
  },
  {
    path: "/resetPassword/",
    name: "resetPassword",
    component: resetPassword,
  },
  {
    path: "/thankyou",
    name: "thankyou",
    component: thankyou,
  },
  {
    path: "/shop",
    name: "shop",
    component: shop,
  },
  {
    path: "/details",
    name: "details",
    component: details,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
  },
  {
    path: "/products",
    name: "product",
    component: product,
  },
  {
    path: "/orders",
    name: "orders",
    component: orders,
  },
  {
    path: "/cancelled_orders",
    name: "cancelled_orders",
    component: cancelled_orders,
  },
  {
    path: "/order_history",
    name: "order_history",
    component: order_history,
  },
  {
    path: "/editProduct",
    name: "editProduct",
    component: editProduct,
  },
  {
    path: "/addProduct",
    name: "addProduct",
    component: addProduct,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.isLoggedIn; // Check login status from Vuex

  if (to.name === "login" && isLoggedIn) {
    // If trying to access the login page while logged in, redirect to welcome
    next({ name: "welcome" });
  } else {
    next(); // Allow navigation to proceed
  }
});

export default router;
