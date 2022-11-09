<template>
  <div 
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
          <router-link id="quick_game" class="router_link" to="/game">Quick Game</router-link>
          <router-link id="set_own_game" class="router_link" to="/options">Set own Game</router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: "HomeScreen",
  data() {
    return {

    }
  },
  methods: {

  }
};
</script>

<style scoped></style>
