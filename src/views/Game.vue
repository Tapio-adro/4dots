<template>
  <div id="window" class="hiden">
    <div class="gui_wrapper">
      <div class="sidebar_wrapper">
        <sidebar
          v-model:is-sidebar-open="isSidebarOpen"
        >
          <collapsible-section
            header="Players"
          >
            <div id="players_data_container">
              <table id="players_data">
                <tr>
                  <th>№</th>
                  <th>
                    <font-awesome-icon icon="fa-solid fa-palette" />
                  </th>
                  <th>
                    <font-awesome-icon icon="fa-solid fa-brain" />
                  </th>
                  <th>
                    <font-awesome-icon icon="fa-regular fa-square" />
                  </th>
                  <th class="small_squares">
                    <div class="small_squares_container">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </th>
                </tr>
                <tr
                  v-for="(player, index) in playersData" :key="index"
                  :class="{
                    player_tr: true, 
                    no_border: index + 1 == playersData.length, 
                    background: index % 2 != 0}"
                >
                  <td> {{ index + 1 }} </td>
                  <td class="color_square_container"> 
                    <div class="color_square" :style="{backgroundColor: player.color}"></div> 
                  </td>
                  <td class="icon_td"> 
                    <font-awesome-icon icon="fa-user"  size="xs" v-if="player.isHuman"/>
                    <font-awesome-icon icon="fa-robot" size="xs" v-else/>
                  </td>
                  <td> {{ player.cellsAmount }} </td>
                  <td> {{ player.dotsAmount }} </td>
                </tr>
              </table>
            </div>
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
import Memorization from '../mixins/Memorization'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faPalette } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faRobot, faUser, faPalette, faSquare, faBrain)
library.add()
library.add()
library.add()

export default {
  name: "Game",
  components: {
    Sidebar,
    CollapsibleSection,
    FontAwesomeIcon
  },
  mixins: [
    Memorization
  ],
  data() {
    return {
      isSidebarOpen: false,
      dataToMemorize: ['isSidebarOpen'],
      playersData: [
        {color: 'red', cellsAmount: 2, dotsAmount: 5, isHuman: false},
        {color: 'blue', cellsAmount: 5, dotsAmount: 11, isHuman: true},
        {color: 'yellow', cellsAmount: 10, dotsAmount: 32, isHuman: false}
      ]
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
      // this.playersData = event.detail;
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
        playersAmount: 4,
        gridSize: 9,
        humansAmount: 1,
        playersPosition: 'default',
        botType: 'default'
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
