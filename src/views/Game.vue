<template>
  <div id="window" class="hiden">
    <div class="wrapper">
      <div class="outer_container">
        <div class="container">
          <table id="table">
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: "Game",
  data() {
    return {

    }
  },
  mounted() {
    this.setQuickGame();
  },
  methods: {
    setQuickGame() {
      let settings = {
        gameOptions: {
          betterBorders: 0,
          maxOptimization: 0,
          boomCircles: 1,
          gameSpeed: 1
        },
        gameRules: {
          homeDef: 0
        },
        playersAmount: 4,
        gridSize: 9,
        humansAmount: 1,
        playersPosition: 'default'
      };
      setTimeout(() => {
        setTimeout(() => {
          if (getAppData('shouldSetDefaultSettings')) {
            setSettings(settings);
          }
        }, 1)
        startGame();
      }, 10)
    }
  }
};
</script>

<style scoped>
  @import "../assets/css/style.css";
</style>
