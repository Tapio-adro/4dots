<template>
  <div id="window">
    <div 
      v-if="curWindow == 'game'"
      class="wrapper"
    >
      <div class="outer_container">
        <div class="container">
          <table id="table">
          </table>
        </div>
      </div>
    </div>
    <div 
      v-if="curWindow == 'home'"
      id="home"
    >
      <div class="title_wrapper">
        <div class="title_container">
          <div class="title">4Dots</div>
          <div class="dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div class="menu_wrapper">
        <div class="menu_container">
          <div class="menu">
            <div
              @click="setQuickGame()"
              id="quick_game"
            >Quick Game</div>
            <div
              id="set_own_game"
            >Set own Game</div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="curWindow == 'settings'"
      id="settings"
    >

    </div>
  </div>
</template>


<script>

export default {
  name: "Game",
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
