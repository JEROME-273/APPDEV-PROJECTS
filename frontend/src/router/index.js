import { createRouter, createWebHistory } from "vue-router";
import aboutus from "../views/aboutus.vue";
import contact from "../views/contact.vue";
import login from "../views/login.vue";
import signup from "../views/signup.vue";
import userProfile from "../views/userProfile.vue";
import welcome from "../views/welcome.vue";
import cart from "../views/cart.vue";
import checkout from "@/views/checkout.vue";
import newPassword from "@/views/newPassword.vue";
import ResetPassword from "@/views/resetPassword.vue";
import thankyou from "@/views/thankyou.vue";
import shop from "@/views/shop.vue";
import details from "@/views/details.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: login, // Home view
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
    path: "/newPassword",
    name: "newPassword",
    component: newPassword,
  },
  {
    path: "/ResetPassword",
    name: "ResetPassword",
    component: ResetPassword,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
