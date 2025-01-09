import { createRouter, createWebHistory } from "vue-router";

import HomeFactory from "../factories/pages/home/HomeFactory.vue";
import LoginFactory from "../factories/pages/login/LoginFactory.vue";
import HamburgersFactory from "../factories/pages/hamburgers/HamburgersFactory.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeFactory,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginFactory,
  },
  {
    path: "/hamburgers",
    name: "hamburgers",
    component: HamburgersFactory,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
