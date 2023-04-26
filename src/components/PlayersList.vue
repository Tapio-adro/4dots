<template>
<div id="players_data_container">
  <table id="players_data">
    <tr>
      <th>№</th>
      <th>
        <font-awesome-icon icon="fa-solid fa-palette" v-tooltip="'Player color'"/>
      </th>
      <th>
        <font-awesome-icon icon="fa-solid fa-brain" v-tooltip="'Bot or human'"/>
      </th>
      <th>
        <font-awesome-icon icon="fa-regular fa-square" v-tooltip="'Amount of cells'"/>
      </th>
      <th class="small_squares">
        <div class="small_squares_container" v-tooltip="'Amount of dots'">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </th>
    </tr>
    <tr
      v-for="(player, index) in playersData" :key="player.color"
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
      </td>
      <td class="number_td"> {{ player.cellsAmount }} </td>
      <td class="number_td"> {{ player.dotsAmount }} </td>
    </tr>
  </table>
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
    playersData: Array
  }
};
</script>