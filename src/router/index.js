import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeScreen.vue";
import SettingsView from "../views/SettingsScreen.vue";
import GameView from "../views/Game.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/game",
    name: "game",
    component: GameView
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
