import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import UserManagementView from "../views/UserManagementView.vue";

const routes = [
  { path: "/", component: LoginView },
  {
    path: "/users",
    component: UserManagementView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("loggedIn") === "true";
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
