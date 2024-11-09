import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import aboutus from '../views/aboutus.vue';
import contact from '../views/contact.vue';
import login from '../views/login.vue';
import signup from '../views/signup.vue';
import userProfile from '../views/userProfile.vue';
import welcome from '../views/welcome.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView // Home view
  },
  {
    path: '/aboutus',
    name: 'aboutus',
    component: aboutus // About Us view
  },
  {
    path: '/contact', // Added leading slash
    name: 'contact',
    component: contact // Contact view
  },
  {
    path: '/login', // Added leading slash
    name: 'login',
    component: login // Login view
  },
  {
    path: '/signup', // Added leading slash
    name: 'signup',
    component: signup // Signup view
  },
  {
    path: '/userProfile', // Added leading slash
    name: 'userProfile',
    component: userProfile // User Profile view
  },
  {
    path: '/welcome', // Added leading slash
    name: 'welcome',
    component: welcome // Welcome view
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
