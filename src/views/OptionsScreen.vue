<template>
  <div id="options">
    <main id="container">
      <div id="options_ui">
        <section>
          <h3>Grid & Players</h3>
          <Dropdown
            label="Players position"
            v-model:value="options.playersPosition"
            :options="['Default', 'Random']"
          />
          <fieldset class="slider_holder">
            <legend>Grid size</legend>
            <VueSlider 
              :min="5"
              :max="21"
              :interval="2"
              :marks="true"
              v-model="options.gridSize"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          <fieldset
            class="slider_holder" 
            :class="{'no_slider': options.maxPlayersAmount == 2}"
          >
            <legend>Players amount</legend>
            <VueSlider 
              v-if="options.maxPlayersAmount != 2"
              :min="2"
              :max="options.maxPlayersAmount"
              :marks="true"
              v-model="options.playersAmount"
              :tooltip="'none'"
              :drag-on-click="true"
            />
            <div v-else class="slider_replacement">
              <div class="half_line"></div>
              <div class="number"><div>{{ 2 }}</div></div>
              <div class="half_line"></div>
            </div>
          </fieldset>
          <fieldset class="slider_holder">
            <legend>Humans amount</legend>
            <VueSlider 
              :min="0"
              :max="options.playersAmount"
              :marks="true"
              v-model="options.humansAmount"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          <div class="summary">
            <template v-if="options.humansAmount == 0">
              {{ options.playersAmount }} bots fight
            </template>
            <template v-else-if="options.humansAmount == 2 && options.playersAmount == 2">
              duel
            </template>
            <template v-else-if="options.humansAmount == options.playersAmount">
              {{ options.humansAmount }} players
            </template>
            <template v-else>
              {{ getWordNumber('player', options.humansAmount) }} and {{ getWordNumber('bot', options.playersAmount - options.humansAmount) }} 
            </template>
            <span class="map_size">
              {{ options.gridSize + ' x ' + options.gridSize }}
            </span>
          </div>
        </section>
        <section>
          <h3>Game Options</h3>
          <fieldset class="slider_holder">
            <legend>Game speed</legend>
            <VueSlider 
              :data="gameSpeedSlider"
              v-model="options.gameSpeed"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          <div class="checkbox_wrapper"></div>
          <label class="checkbox">
            <input type="checkbox" v-model="options.betterBorders"/>
            <span>Enable better borders</span>
          </label>
          <br>
          max optimization
          <br>
          boom circles

        </section>
        <section>
          <h3>Game Rules</h3>

          homeland defense 
        </section>
      </div>
      <div id="options_description">
        <section>

        </section>
      </div>
    </main>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import Dropdown from '../components/Dropdown.vue'

export default {
  name: "OptionsScreen",
  components: {
    VueSlider,
    Dropdown
  },
  data() {
    return {
      options: {
        playersPosition: 'Default',
        gridSize: 9,
        playersAmount: 4,
        maxPlayersAmount: 8,
        humansAmount: 1,
        betterBorders: true,
        gameSpeed: '0'
      },
      gameSpeedSlider: this.getSliderData()
    }
  },
  computed: {
    playersAmount() {
      return this.options.playersAmount;
    },
    gridSize() {
      return this.options.gridSize;
    },
    playersPosition() {
      return this.options.playersPosition;
    }
  },
  watch: {
    playersAmount() {
      if (!(this.options.playersAmount < this.options.humansAmount)) return;
      this.options.humansAmount = this.options.playersAmount;
    },
    gridSize() {
     this.updateMaxPlayersAmount()
    },
    playersPosition() {
     this.updateMaxPlayersAmount()
    }
  },
  mounted() {
  },
  methods: {
    updateMaxPlayersAmount() {
      let playersPosition = this.options.playersPosition.toLowerCase();
      let gridSize = this.options.gridSize;
      if (playersPosition == 'default') {
        let playersToSize = [
          [5, 2],
          [7, 4],
          [9, 8]
        ]
        if (gridSize > 9) {
          this.options.maxPlayersAmount = 8
        } else {
          this.options.maxPlayersAmount = playersToSize.find(elem => elem[0] >= this.options.gridSize)[1]
        }
      } else {
        let playersToSize = [
        [ 5, 2 ],
        [ 7, 4 ],
        [ 9, 9 ],
        [ 11, 14 ]
        ]
        if (gridSize > 11) {
          this.options.maxPlayersAmount = 20
        } else {
          this.options.maxPlayersAmount = playersToSize.find(elem => elem[0] >= this.options.gridSize)[1]
        }
      }
      if (!(this.options.maxPlayersAmount < this.options.playersAmount)) return;
      this.options.playersAmount = this.options.maxPlayersAmount;
    },
    getWordNumber(word, number) {
      if (number == 1) {
        return number + ' ' + word
      }
      else {
        return number + ' ' + word + 's'
      }
    },
    getSliderData() {
      return {
        '0': 'Normal',
        '1': 'Fast',
        '2': 'Instant'
      }
    }
  }
};
</script>

<style scoped></style>
