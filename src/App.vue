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
      lang: lang,
      curLang: 'en'
    }
  },
  watch: {
    $route (to, from) {
      window.localStorage.setItem('curWindow', JSON.stringify(to.name))
      setTimeout(() => {
        setAppData('curWindow', to.name)
      }, 100)
      if (from.name !== undefined) {
        window.localStorage.setItem('lastWindow', JSON.stringify(from.name))
      }
    },
    // curLang() {
    //   setTimeout(() => {
    //     setAppData('lang', this.curLang)
    //   }, 100)
    //   window.localStorage.setItem('lang', JSON.stringify(this.curLang))
    // }
  },
  mounted() {
    this.checkWindowData()
    setTimeout(() => {
      setAppData('lang', this.curLang)
    }, 100) 
    // if (JSON.parse(window.localStorage.getItem('lang'))) {
    //   this.curLang = JSON.parse(window.localStorage.getItem('lang'))
    // }
    if (localStorage.getItem("globalSettings") === null) {
      window.localStorage.setItem('globalSettings', JSON.stringify(getDefaultGlobalSettings()))
    }
  },
  methods: {
    handleGoBackClick() {
      this.$router.go(-1);
      this.$refs.goBackButton.classList.remove('highlight');
    },
    getLangString(key) {
      return this.lang[this.curLang][key]
    },
    checkWindowData() {
      if (!window.localStorage.getItem('curWindow')) {
        window.localStorage.setItem('curWindow', JSON.stringify('home'))
      }
      if (!window.localStorage.getItem('lastWindow')) {
        window.localStorage.setItem('lastWindow', JSON.stringify('home'))
      }
    }
  },
}

function getDefaultGlobalSettings () {
  return {
    playersPosition: 'default',
    gridSize: 9,
    playersAmount: 4,
    maxPlayersAmount: 8,
    humansAmount: 1,
    gameSpeed: '1',
    maxOptimization: false,
    boomCircles: true,
    homelandDefense: true,
    pointerOnBotTurn: true,
    botType: 'default',
    gatherPlayersData: true,
    gatherLinechartsData: true,
    gatherHeatmapData: true
  }
}
</script>