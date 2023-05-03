<template>
<div id="players_data_container">
  <div id="players_data">
    <div class="row header_row">
      <div class="player_index">№</div>
      <div class="player_color">
        <font-awesome-icon icon="fa-solid fa-palette" v-tooltip="'Player color'"/>
      </div>
      <div class="player_type">
        <font-awesome-icon icon="fa-solid fa-brain" v-tooltip="'Bot or human'"/>
      </div>
      <div class="player_cells">
        <font-awesome-icon icon="fa-regular fa-square" v-tooltip="'Amount of cells'"/>
      </div>
      <div class="player_dots small_squares">
        <div class="small_squares_container" v-tooltip="'Amount of dots'">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    <template
      v-for="(player, index) in playersData" :key="player.color"
    >
      <div
        class="row player_row"
        :class="{
          no_border: index + 1 == playersData.length, 
          background: index % 2 != 0}"
      >
  
        <div class="player_index"> {{ index + 1 }} </div>
        <div class="player_color color_square_container"> 
          <div class="color_square" :style="{backgroundColor: player.color}"></div> 
        </div>
        <div class="player_type icon_div"> 
          <font-awesome-icon 
            v-if="player.isHuman"
            icon="fa-user"  
            size="xs" 
            v-tooltip="'Human'"
          />
          <font-awesome-icon
            v-else
            icon="fa-robot"
            size="xs"
            v-tooltip="'Bot'"
          />
        </div>
        <div class="player_cells number_td"> {{ player.cellsAmount }} </div>
        <div class="player_dots number_td"> {{ player.dotsAmount }} </div>
      </div>
      <div v-if="globalSettings.gatherLinechartsData" class="chart_row">
        <div class="chart_container">
          <canvas :id="playersStatistics[player.color].chartId"></canvas>
        </div>
      </div>
    </template>
  </div>
</div>
</template>

<script>
import 'floating-vue/dist/style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faPalette } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faRobot, faUser, faPalette, faSquare, faBrain)


export default {
  name: "PlayersList",
  components: {
    FontAwesomeIcon
  },
  props: {
    playersData: Array,
    playersStatistics: Object,
    globalSettings: Object
  }
};
</script>