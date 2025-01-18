import { createRouter, createWebHistory } from "vue-router";


import HomeFactory from "../factories/pages/home/HomeFactory.vue";
import LoginFactory from "../factories/pages/login/LoginFactory.vue";
import HamburgersFactory from "../factories/pages/hamburgers/HamburgersFactory.vue";
import BeveragesFactory from "../factories/pages/beverages/BeveragesFactory.vue";
import AppetizersFactory from "../factories/pages/appetizers/AppetizersFactory.vue";
import CategoriesFactory from "../factories/pages/categories/CategoriesFactory.vue";

import DessertsFactory from "../factories/pages/desserts/DessertsFactory.vue";
import PaymentFactory from "../factories/pages/payment/PaymentFactory.vue";


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
  {
    path: "/categories",
    name: "categories",
    component: CategoriesFactory,
  },
  {
    path: "/Appetizers",
    name: "appetizers",
    component: AppetizersFactory,
  },
  {
    path: "/beverages",
    name: "beverages",
    component: BeveragesFactory,
  },
  {
    path: "/Desserts",
    name: "desserts",
    component: DessertsFactory,
  },
  {
    path: "/Payment",
    name: "payment",
    component: PaymentFactory,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
