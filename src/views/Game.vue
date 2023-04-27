<template>
  <div id="window" class="hidden">
    <div class="gui_wrapper">
      <div class="sidebar_wrapper">
        <sidebar
          v-model:is-sidebar-open="isSidebarOpen"
        >
          <collapsible-section
            header="Players"
          >
            <PlayersList
              :playersData="playersData"
            />
          </collapsible-section>

        </sidebar>
      </div>
      <div class="wrapper">
        <div class="container">
          <table id="table">
          </table>
        </div>
      </div>
      <div class="sidebar_wrapper">
      </div>
    </div>
    <div id="win_overlay" class="hidden"></div>
  </div>
</template>


<script>
import Sidebar from '../components/Sidebar.vue';
import CollapsibleSection from '../components/CollapsibleSection.vue';
import PlayersList from '../components/PlayersList.vue';

import Memorization from '../mixins/Memorization'


export default {
  name: "Game",
  components: {
    Sidebar,
    CollapsibleSection,
    PlayersList
  },
  mixins: [
    Memorization
  ],
  data() {
    return {
      isSidebarOpen: false,
      dataToMemorize: ['isSidebarOpen'],
      playersData: []
    }
  },
  mounted() {
    this.setQuickGame();
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    removeElementsByClass('boom_circle')
    removeElementsByClass('bot_pointer')
    removeElementsByClass('homeland_area')

    function removeElementsByClass(className){
      let elements = document.getElementsByClassName(className);
      while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
      }
    }

    window.addEventListener('passPlayersData', this.updatePlayersData) 
  },
  beforeUnmount() {
    let id = window.setTimeout(function() {}, 0);
    while (id--) {
      window.clearTimeout(id);
    }

    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    var winnerPanel = document.querySelector('#win_overlay')
    winnerPanel.classList.add('hidden');
  },  
  methods: {
    updatePlayersData(event) {
      this.playersData = event.detail;
    },
    setQuickGame() {
      let settings = {
        gameOptions: {
          maxOptimization: 0,
          boomCircles: 1,
          gameSpeed: 1,
          pointerOnBotTurn: 1,
        },
        gameRules: {
          homeDef: 1
        },
        gridAndPlayers: {
          playersAmount: 4,
          gridSize: 9,
          humansAmount: 1,
          playersPosition: 'default',
          botType: 'default'
        }
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
