<template>
  <div 
    id="home"
  >
    <div id="lang">
      <img src="../assets/img/ua.png" alt="flag_ua" @click="$root.curLang = 'uk'">
      <img src="../assets/img/us_uk.png" alt="flag_en" @click="$root.curLang = 'en'">
    </div>
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
          <router-link id="quick_game" class="router_link" to="/game" @click="runQuickGame">{{ l('quickGame') }}</router-link>
          <router-link id="set_own_game" class="router_link" to="/settings">{{ l('customGame') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: "HomeScreen",
  methods: {
    runQuickGame() {
      setAppData('shouldSetDefaultSettings', true)
    },
    l(key) {
      return this.$root.getLangString('home.' + key)
    }
  }
};
</script>

<style scoped></style>
