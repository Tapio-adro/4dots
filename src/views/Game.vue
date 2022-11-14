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
          betterBorders: 1,
          maxOptimization: 0,
          boomCircles: 1,
          gameSpeed: 0
        },
        gameRules: {
          homeDef: 1
        },
        playersAmount: 9,
        gridSize: 9,
        humansAmount: 0,
        playersPosition: 'random'
      };
      setTimeout(() => {
        setSettings(settings);
        startGame();
      }, 0)
    }
  }
};
</script>

<style scoped>
  @import "../assets/css/style.css";
</style>
