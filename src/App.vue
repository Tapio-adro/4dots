<template>
  <div id="window">
    <Game
      v-if="curWindow == 'game'"
    />
    <HomeScreen
      v-if="curWindow == 'home'"
      @change-window-to-game="curWindow = 'game'"
    />
  </div>
</template>

<script>
import Game from './components/Game.vue'
import HomeScreen from './components/HomeScreen.vue'

export default {
  name: 'App',
  data() {
    return {
      curWindow: 'home'
    }
  },
  components: {
    Game,
    HomeScreen
  },
  mounted() {
    // setTimeout(() => {
    //   setAppData('curWindow', this.curWindow);
    // }, 100)
  },
  watch: {
    curWindow () {
      setAppData('curWindow', this.curWindow);
    }
  }
}
</script>

<style></style>
