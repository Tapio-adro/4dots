<template>
<div id="window" class="hidden">
  <div class="gui_wrapper">
    <div class="sidebar_wrapper left">
      <sidebar
        v-if="globalSettings.gatherPlayersData"
        ref="sidebar"
        v-model:is-sidebar-open="isSidebarOpen"
      >
        <collapsible-section
          v-if="globalSettings.gatherLinechartsData"
          :header="l('sharedChart')"
          v-model:is-open="isPlayersSectionOpened"
        >
          <div class="chart_wrapper">
            <div class="chart_container">
              <canvas id="shared_linechart"></canvas>
            </div>
          </div>
        </collapsible-section>
        <collapsible-section
          :header="l('players')"
          v-model:is-open="isSharedChartSectionOpened"
        >
          <PlayersList
            v-if="globalSettings.gatherPlayersData"
            :playersData="playersData"
            :playersStatistics="playersStatistics"
            :globalSettings="globalSettings"
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
      dataToMemorize: ['isSidebarOpen', 'isPlayersSectionOpened', 'isSharedChartSectionOpened'],
      playersData: [],
      undefeatedPlayersData: [],
      defeatedPlayersData: [],
      playersStatistics: {},
      sharedPlayersStatistics: {},
      globalSettings: JSON.parse(localStorage.getItem('globalSettings')),
      isPlayersSectionOpened: true,
      isSharedChartSectionOpened: true
    }
  },
  mounted() {
    this.setGame();
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    this.removeLeftoverElements()

    window.addEventListener('passPlayersData', this.updatePlayersData) 
    window.addEventListener('passInitialPlayersData', this.initPlayersStatistics)
    
    if (this.globalSettings.gatherPlayersData) {
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
    l(key) {
      return this.$root.getLangString('game.' + key)
    },
    initPlayersStatistics(event) {
      let playersData = event.detail;
      this.playersData = playersData;

      if (!this.globalSettings.gatherLinechartsData) return;

      for (let playerData of playersData) {
        this.playersStatistics[playerData.color] = {
          cellsAmount: [], 
          dotsAmount: [],
          chartId: rgbToId(playerData.color)
        }
      }

      let interval = setInterval(() => {
        for (let playerData of playersData) {
          let canvas = document.getElementById(rgbToId(playerData.color))
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
        let sharedLinechartCanvas = document.getElementById('shared_linechart')
        if (sharedLinechartCanvas) {
          if (!Object.hasOwn(this.sharedPlayersStatistics, 'chart')) {
            let ctx = sharedLinechartCanvas.getContext('2d');
            let colors = playersData.map(data => data.color)
            let chart = getSharedChart(ctx, colors)
            Object.seal(chart)
            this.sharedPlayersStatistics.chart = chart
          }
        } else {
          return;
        }
        clearInterval(interval);
        confirmGameStart();
      }, 100)
    },
    updatePlayersStatistics() {
      if (!this.globalSettings.gatherLinechartsData) return;

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

      let chart = this.sharedPlayersStatistics.chart
      if (chart.data.datasets[0].data[1] != 0) {
        chart.data.labels.push('');
      }
      let totalCellsAmount = this.undefeatedPlayersData.reduce((sum, playerData) => sum + playerData.cellsAmount, 0);
      for (let dataset of chart.data.datasets) {
        let color = dataset.borderColor;
        let foundPlayerData = this.undefeatedPlayersData.find(data => data.color == color);
        let valueToPush = foundPlayerData ? foundPlayerData.cellsAmount / totalCellsAmount : 0;
        if (dataset.data[1] == 0) {
          dataset.data.shift();
        }
        dataset.data.push(valueToPush);
      }
      chart.update();
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
    setGame() {
      let settings = getDefaultSettings()
      setTimeout(() => {
        if (JSON.parse(window.localStorage.getItem('lastWindow')) == 'settings') {
          setSettings(JSON.parse(window.localStorage.getItem('settingsToSet')))
        } else {
          this.globalSettings = getDefaultGlobalSettings()
          setSettings(settings);
        }
        startGame();
        if (!this.globalSettings.gatherLinechartsData) {
          confirmGameStart();
        }
        setAppData('globalSettings', this.globalSettings)
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
      },
      animation: {     
        y: {
          duration: 0 
        }
      }
    }
  });
}
function getSharedChart (ctx, borderColors) {
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['', '', '', '', '', '', '', '', '', ''],
      datasets: []
    },
    options: {
      scales: {
        y: {
          max: 1,
          stacked: true,
          ticks: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      animation: {     
        y: {
          duration: 0 
        }
      }
    }
  });
  let datasetTemplate = {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    borderWidth: 3,
    cubicInterpolationMode: 'monotone',
    pointStyle: false,
    fill: true
  }
  for (let [index, value] of borderColors.entries()) {
    let dataset = JSON.parse(JSON.stringify(datasetTemplate))
    dataset.borderColor = value
    dataset.backgroundColor = rgbaHalfOpacity(value)

    chart.data.datasets.push(dataset)
  }
  return chart;
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

<style scoped>
  @import "../assets/css/style.css";
</style>
