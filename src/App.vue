<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/multiply-trainer">multiply-trainer</router-link>
  </nav> -->
  <router-view />
</template>


<script>

export default {
  name: 'App',
  data() {
    return {
      devMode: 0
    }
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
  }
}
</script>