<template>
<div id="window" class="hidden">
  <div class="gui_wrapper">
    <div class="sidebar_wrapper left">
      <sidebar
        ref="sidebar"
        v-model:is-sidebar-open="isSidebarOpen"
      >
        <collapsible-section
          header="Players"
        >
          <PlayersList
            :playersData="playersData"
            :playersStatistics="playersStatistics"
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
      isSidebarOpen: true,
      dataToMemorize: ['isSidebarOpen'],
      playersData: [],
      undefeatedPlayersData: [],
      defeatedPlayersData: [],
      playersStatistics: {}
    }
  },
  mounted() {
    this.setQuickGame();
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    this.removeLeftoverElements()

    window.addEventListener('passPlayersData', this.updatePlayersData) 
    window.addEventListener('passInitialPlayersData', this.initPlayersStatistics)
    
    let that = this
    this.$refs.sidebar.$refs.sidebar.onscroll = function (e) { 
      let scrollValue = that.$refs.sidebar.$refs.sidebar.scrollTop
      if (scrollValue >= 15) {
        document.getElementById('go_back_button').classList.add('hidden');
      } 
      if (scrollValue == 0) {
        document.getElementById('go_back_button').classList.remove('hidden');
      }
    } 
  },
  beforeUnmount() {
    window.removeEventListener('passPlayersData', this.updatePlayersData)
    window.removeEventListener('passInitialPlayersData', this.initPlayersStatistics)
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
    initPlayersStatistics(event) {
      let playersData = event.detail;
      this.playersData = playersData;
      for (let playerData of playersData) {
        this.playersStatistics[playerData.color] = {
          cellsAmount: [], 
          dotsAmount: [],
          chartId: rgbToId(playerData.color)
        }
      }
      let interval = setInterval(() => {
        for (let playerData of playersData) {
          const canvas = document.getElementById(rgbToId(playerData.color))
          if (canvas) {
            if (Object.hasOwn(this.playersStatistics[playerData.color], 'chart')) continue;

            let ctx = canvas.getContext('2d');
            let chart = getDefaultChart(ctx, playerData.color, rgbaHalfOpacity(playerData.color))
            Object.seal(chart)
            this.playersStatistics[playerData.color].chart = chart

          } else {
            return;
          }
        }
        clearInterval(interval);
        confirmGameStart();
      }, 100)
    },
    updatePlayersStatistics() {
      let playersData = this.undefeatedPlayersData.slice();
      playersData.push(...this.defeatedPlayersData);
      for (let playerData of playersData) {
        this.playersStatistics[playerData.color].cellsAmount.push(playerData.cellsAmount);
        this.playersStatistics[playerData.color].dotsAmount.push(playerData.dotsAmount);
        let chart = this.playersStatistics[playerData.color].chart;
        let chartDataset = chart.data.datasets[0];
        if (chartDataset.data[1] == 0) {
          chart.data.datasets[0].data.shift();
          chart.data.datasets[0].data.push(playerData.cellsAmount);
        } else {
          chart.data.labels.push('');
          chart.data.datasets[0].data.push(playerData.cellsAmount);
        }
        chart.update();
      }
    },
    updatePlayersData(event) {
      let newPlayersData = event.detail;

      if (newPlayersData.length != this.undefeatedPlayersData.length
        && this.undefeatedPlayersData.length != 0) {

        mainLoop: for (let playerData of this.undefeatedPlayersData) {
          for (let newPlayerData of newPlayersData) {
            if (playerData.color == newPlayerData.color) {
              continue mainLoop
            }
          }
          this.defeatedPlayersData.unshift({
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

      this.updatePlayersStatistics();
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

function rgbaHalfOpacity(rgbColorString) {
  var rgbValues = rgbColorString.match(/\d+/g).map(Number);
  
  var rgbaValues = rgbValues.concat(0.5);
  
  return "rgba(" + rgbaValues.join(",") + ")";
}
function rgbToId (rgbString) {
  return rgbString.replaceAll(',', '').replaceAll(' ', '').replace('(', '').replace(')', '')
}

function getDefaultChart (ctx, borderColor, backgroundColor) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderWidth: 3,
        cubicInterpolationMode: 'monotone',
        pointStyle: false,
        fill: true,
        borderColor,
        backgroundColor
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
}

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
