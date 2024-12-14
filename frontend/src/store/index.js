import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    isLoggedIn: false, // Default state
    user: null,
  },
  mutations: {
    setLoginStatus(state, status) {
      state.isLoggedIn = status;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async checkLoginStatus({ commit }) {
      try {
        const response = await axios.get("/welcome");
        commit("setLoginStatus", true);
        commit("setUser", response.data.user);
      } catch (error) {
        commit("setLoginStatus", false);
        commit("setUser", null);
      }
    },
    async logout({ commit }) {
      try {
        await axios.get("/logout");
        commit("setLoginStatus", false);
        commit("setUser", null);
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
  },
});

export default store;
