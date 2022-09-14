<template>
  <div id="window">
    <div 
      v-if="curWindow == 'game'"
      class="wrapper"
    >
      <div id="container">
        <table id="table">
        </table>
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
            <div id="quick_game">Quick Game</div>
            <div id="set_own_game">Set own Game</div>
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
  mounted() {
  }
};

</script>

<style scoped></style>
