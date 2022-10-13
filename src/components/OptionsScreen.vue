<template>
  <div></div>
</template>


<script>

export default {
  name: "OptionsScreen",
  data() {
    return {
      curWindow: 'home', 
      gui: {

      }
    }
  },
  methods: {
    setQuickGame() {
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
      this.curWindow = 'game';
      setTimeout(() => {
        setSettings(settings);
        startGame();
      }, 10)
    }
  },
  mounted() {
    setTimeout(() => {
      setAppData('curWindow', this.curWindow);
    }, 100)
  },
  watch: {
    curWindow () {
      setAppData('curWindow', this.curWindow);
    }
  },
};
</script>

<style scoped></style>
