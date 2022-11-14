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
          <fieldset class="slider_holder">
            <legend>Players amount</legend>
            <VueSlider 
              :min="2"
              :max="options.maxPlayersAmount"
              :marks="true"
              v-model="options.playersAmount"
              :tooltip="'none'"
              :drag-on-click="true"
            />
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
        </section>
        <section>
          <h3>Game Options</h3>

          game speed
          <br>
          border type
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
        humansAmount: 1
      }
    }
  },
  computed: {
    playersAmount() {
      return this.options.playersAmount;
    },
    gridSize() {
      return this.options.gridSize;
    }
  },
  watch: {
    playersAmount() {
      if (!(this.options.playersAmount < this.options.humansAmount)) return;
      this.options.humansAmount = this.options.playersAmount;
    },
    gridSize() {
      let playersToSize = [
        [7, 4],
        [9, 8]
      ]
      let playersPosition = this.options.playersPosition.toLowerCase();
      let gridSize = this.options.gridSize;
      if (playersPosition == 'default') {
        console.log('obj');
        if (gridSize > 9) {
          this.options.maxPlayersAmount = 8
        } else {
          this.options.maxPlayersAmount = playersToSize.find(elem => elem[0] >= this.options.gridSize)[1]
        }
        if (!(this.options.maxPlayersAmount < this.options.playersAmount)) return;
        this.options.playersAmount = this.options.maxPlayersAmount;
      }
    }
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped></style>
