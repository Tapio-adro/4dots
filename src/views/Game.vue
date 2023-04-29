<template>
<div id="window" class="hidden">
  <div class="gui_wrapper">
    <div class="sidebar_wrapper left">
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
        <div class="chart_container">
          <canvas id="myChart"></canvas>
        </div>

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

import Chart from 'chart.js/auto';


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
      playersData: [],
      undefeatedPlayersData: [],
      defeatedPlayersData: []
    }
  },
  mounted() {
    const ctx = document.getElementById('myChart').getContext('2d');

    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['', '', '', '', '', '', '', '', '', '', ''],
        datasets: [{
          data: [1, 0, 0, 0, 1, 4, 5, 8, 10, 7, 2],
          borderWidth: 1,
          cubicInterpolationMode: 'monotone',
          pointStyle: false,
          borderWidth: 3,
          fill: true,
          borderColor: 'rgb(51, 204, 255)',
          backgroundColor: 'rgba(51, 204, 255, 0.5)'
        }]
      },
      options: {
        scales: {
          y: {
            suggestedMax: 15
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    this.setQuickGame();
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    this.removeLeftoverElements()

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
      let newPlayersData = event.detail;
      if (newPlayersData.length != this.undefeatedPlayersData.length
        && this.undefeatedPlayersData.length != 0) {

        mainLoop: for (let playerData of this.undefeatedPlayersData) {
          for (let newPlayerData of newPlayersData) {
            if (playerData.color == newPlayerData.color) {
              console.log('continue mainloop');
              continue mainLoop
            }
          }
          console.log('found defeated');
          this.defeatedPlayersData.push({
            color: playerData.color,
            cellsAmount: 0,
            dotsAmount: 0,
            isHuman: playerData.isHuman
          });
        }
      }
      this.undefeatedPlayersData = newPlayersData;
      this.playersData = this.undefeatedPlayersData.slice();
      this.playersData.push(...this.defeatedPlayersData)
    },
    setQuickGame() {
      let settings = getDefaultSettings()
      setTimeout(() => {
        if (JSON.parse(window.localStorage.getItem('lastWindow')) == 'settings') {
          setSettings(JSON.parse(window.localStorage.getItem('settingsToSet')))
        } else {
          setSettings(settings);
        }
        startGame();
      }, 100)
    },
    removeLeftoverElements() {
      removeElementsByClass('boom_circle')
      removeElementsByClass('bot_pointer')
      removeElementsByClass('homeland_area')

      function removeElementsByClass(className){
        let elements = document.getElementsByClassName(className);
        while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
        }
      }
    }
  }
};

function getDefaultSettings() {
  return {
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
}
</script>

<style scoped>
  @import "../assets/css/style.css";
</style>
