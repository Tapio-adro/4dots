<template>
  <Game
    v-if="curWindow == 'game'"
  />
  <HomeScreen
    v-if="curWindow == 'home'"
    @change-window-to-game="curWindow = 'game'"
  />
</template>

<script>
import Game from './components/Game.vue'
import HomeScreen from './components/HomeScreen.vue'

export default {
  name: 'App',
  data() {
    return {
      curWindow: 'home',
      devMode: 0
    }
  },
  components: {
    Game,
    HomeScreen
  },
  mounted() {
    if (this.devMode) {
      let settings = {
        gameOptions: {
          betterBorders: 1,
          maxOptimization: 0,
          boomCircles: 1,
          gameSpeed: 0
        },
        gameRules: {
          homeDef: 1
        },
        playersAmount: 4,
        humansAmount: 1
      };
      setTimeout(() => {
        this.curWindow = 'game';
      }, 5)
      setTimeout(() => {
        setSettings(settings);
        startGame();
      }, 10)
    } 
  },
  watch: {
    curWindow () {
      setAppData('curWindow', this.curWindow);
    }
  }
}
</script>

<style></style>
