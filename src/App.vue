<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/multiply-trainer">multiply-trainer</router-link>
  </nav> -->
  <div id="go_back_button" @click="handleGoBackClick" v-if="$route.name != 'home'" ref="goBackButton">&#8656;</div>
  <router-view/>
</template>


<script>
import lang from './assets/json/lang.json'

export default {
  name: 'App',
  data() {
    return {
      devMode: 0,
      lang: lang,
      curLang: 'uk'
    }
  },
  watch: {
    $route (to, from){
      setTimeout(() => {
        setAppData('curWindow', to.name);
        if (from.name == 'options' || from.name == 'home') {
          setAppData('lastWindow', from.name)
        }
      }, 100)
    },
    curLang() {
      setTimeout(() => {
        setAppData('lang', this.curLang)
      }, 100)
      window.localStorage.setItem('lang', JSON.stringify(this.curLang))
    }
  },
  mounted() {
    if (this.devMode) {
      let settings = {
        gameOptions: {
          maxOptimization: 0,
          boomCircles: 0,
          gameSpeed: 0
        },
        gameRules: {
          homeDef: 0
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
    setTimeout(() => {
      setAppData('lang', this.curLang)
    }, 100) 
    if (JSON.parse(window.localStorage.getItem('lang'))) {
      this.curLang = JSON.parse(window.localStorage.getItem('lang'))
    }
  },
  methods: {
    handleGoBackClick() {
      this.$router.go(-1);
      this.$refs.goBackButton.classList.remove('highlight');
    },
    getLangString(key) {
      return this.lang[this.curLang][key]
    }
  },
}
</script>