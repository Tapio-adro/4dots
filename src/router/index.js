import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeScreen.vue";
import OptionsView from "../views/OptionsScreen.vue";
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
    path: "/options",
    name: "options",
    component: OptionsView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
