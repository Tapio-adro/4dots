<template>
  <div id="window" class="hiden">
    <div class="gui_wrapper">
      <div class="side_bar">
        <!-- <div id="messages"></div> -->
      </div>
      <div class="wrapper">
        <div class="outer_container">
          <div class="container">
            <table id="table">
            </table>
          </div>
        </div>
      </div>
      <div class="side_bar">
      </div>
    </div>
    <div id="win_overlay" class="hidden"></div>
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
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    var root = document.getElementsByTagName('html')[0];
    root.setAttribute('class', '');
  },
  beforeUnmount() {
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    var root = document.getElementsByTagName('html')[0];
    root.setAttribute('class', 'rotated');
    var winnerPanel = document.querySelector('#win_overlay')
    winnerPanel.classList.add('hidden');
  },  
  methods: {
    setQuickGame() {
      let settings = {
        gameOptions: {
          betterBorders: 1,
          maxOptimization: 0,
          boomCircles: 1,
          gameSpeed: 0,
          pointerOnBotTurn: 0
        },
        gameRules: {
          homeDef: 1
        },
        playersAmount: 4,
        gridSize: 9,
        humansAmount: 1,
        playersPosition: 'default'
      };
      setTimeout(() => {
        setTimeout(() => {
          if (getAppData('shouldSetDefaultSettings') && !getAppData('devMode')) {
            setSettings(settings);
          }
        }, 1)
        startGame();
      }, 100)
    }
  }
};
</script>

<style scoped>
  @import "../assets/css/style.css";
</style>
