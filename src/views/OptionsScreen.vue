<template>
  <div id="options">
    <main id="container">
      <div id="options_ui">
        <section>
          <h3>Grid & Players</h3>
          <Dropdown
            label="Players position"
            v-model:value="options.playersPosition"
            :options="{'default': 'Default', 'random':'Random'}"
            @mouseover="description = 'grid.position'"
          />
          <fieldset class="slider_holder"
            @mouseover="description = 'grid.size'"
          >
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
            @mouseover="description = 'grid.players'"
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
          <fieldset class="slider_holder"
            @mouseover="description = 'grid.humans'"
          >
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
          <fieldset class="slider_holder"
            @mouseover="description = 'options.gameSpeed'"
          >
            <legend>Game speed</legend>
            <VueSlider 
              :data="gameSpeedSlider"
              v-model="options.gameSpeed"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          
          <Checkbox
            @mouseover="description = 'options.betterBorders'"
            label="Enable better borders"
            v-model:checked="options.betterBorders"
          />
          <Checkbox
            @mouseover="description = 'options.optimization'"
            label="Enable maximal optimization"
            v-model:checked="options.maxOptimization"
          />
          <Checkbox
            @mouseover="description = 'options.circles'"
            label="Enable blast circles"
            v-model:checked="options.boomCircles"
            :class="{'inactive': options.maxOptimization}"
          />
        </section>
        <section>
          <h3>Game Rules</h3>
          <Checkbox
            @mouseover="description = 'rules.homelandDefense'"
            label="Homeland defense"
            v-model:checked="options.homelandDefense"
          />
        </section>
      </div>
      <div id="options_description">
        <section @mouseover="description = 'presets'" >
          <h3>Presets</h3>
          <Dropdown
            label="Choose preset"
            v-model:value="presetKey"
            :options="getPresets(true)"
          />
        </section>
        <section id="description">
          <h3
            @click="toggleDescription()"
          >
          Description
          <span class="tooltip">{{ getToggleString('Click to toggle description', updateDescription) }}</span>
          </h3>
          <h4>{{ descriptionData.sectionName }}</h4>
          <div>{{ descriptionData.sectionDescription }}</div>
          <div id="part_descr">
            <div class="arrow" v-if="description != '' && description != 'presets'">
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </div>
            <div class="text">
              <h4>{{ descriptionData.partName }}</h4>
              <div>{{ descriptionData.partDescription }}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import Dropdown from '../components/Dropdown.vue'
import Checkbox from '../components/Checkbox.vue'

export default {
  name: "OptionsScreen",
  components: {
    VueSlider,
    Dropdown,
    Checkbox
  },
  data() {
    return {
      options: {
        playersPosition: 'default',
        gridSize: 9,
        playersAmount: 4,
        maxPlayersAmount: 8,
        humansAmount: 1,
        betterBorders: true,
        gameSpeed: '0',
        maxOptimization: false,
        boomCircles: true,
        homelandDefense: false
      },
      presetKey: 'none',
      gameSpeedSlider: this.getSliderData(),
      updateDescription: false,
      description: '',
      descriptionData: {}
    }
  },
  computed: {
    playersAmount() {
      return this.options.playersAmount;
    },
    maxOptimization() {
      return this.options.maxOptimization;
    },
    gridSize() {
      return this.options.gridSize;
    },
    playersPosition() {
      return this.options.playersPosition;
    }
  },
  watch: {
    description() {
      if (!this.updateDescription) {
        this.description = '';
        return;
      }

      let sectionsDescription = getDescriptionData();
      let descr = {};
      if (this.description == 'presets') {
        descr.sectionName = sectionsDescription['presets'].name;
        descr.sectionDescription = sectionsDescription['presets'].description;   
        descr.partName = '';
        descr.partDescription = '';     
        this.descriptionData = descr;
        return;
      }
      let [section, part] = this.description.split('.');
      descr.sectionName = sectionsDescription[section].name;
      descr.sectionDescription = sectionsDescription[section].description;
      descr.partName = sectionsDescription[section].parts[part].name;
      descr.partDescription = sectionsDescription[section].parts[part].description;
      this.descriptionData = descr;
    },
    playersPosition() {
      this.updateMaxPlayersAmount()
    },
    gridSize() {
      this.updateMaxPlayersAmount()
    },
    playersAmount() {
      if (!(this.options.playersAmount < this.options.humansAmount)) return;
      this.options.humansAmount = this.options.playersAmount;
    },
    maxOptimization() {
      if (this.options.maxOptimization) {
        this.options.boomCircles = false;
      }
    },
    presetKey() {
      this.setPreset()
    }
  },
  mounted() {
    this.getPresets(true);
  },
  methods: {
    updateMaxPlayersAmount() {
      let playersPosition = this.options.playersPosition;
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
    },
    getPresets(getDropdownValues = false) {
      let presets = {
        classic: {
          name: 'Classic',
          betterBorders: false,
          boomCircles: false
        },
        duel: {
          name: 'Duel',
          playersAmount: 2,
          humansAmount: 2
        },
        bigBotFight: {
          name: 'Big bot fight',
          playersPosition: 'random',
          gridSize: 11,
          playersAmount: 8,
          humansAmount: 0,
          gameSpeed: '1'
        },
        hugeBotFight: {
          name: 'Huge bot fight',
          playersPosition: 'random',
          gridSize: 15,
          playersAmount: 16,
          humansAmount: 0,
          gameSpeed: '2',
          maxOptimization: true
        },
        homelandDefense: {
          name: 'Homeland defense',
          playersPosition: 'random',
          gridSize: 11,
          playersAmount: 4,
          humansAmount: 1,
          gameSpeed: '0',
          homelandDefense: true
        }
      }
      if (getDropdownValues) {
        let dropdownValues = {};
        for (let [key, value] of Object.entries(presets)) {
          dropdownValues[key] = value['name'];
        }
        return dropdownValues;
      }
      return presets;
    },
    setPreset() {
      let defaultOptions = {
        playersPosition: 'default',
        gridSize: 9,
        playersAmount: 4,
        maxPlayersAmount: 8,
        humansAmount: 1,
        betterBorders: true,
        gameSpeed: '0',
        maxOptimization: false,
        boomCircles: true,
        homelandDefense: false
      };
      this.options = defaultOptions;
      let preset = Object.entries(this.getPresets()[this.presetKey]);
      let that = this;
      let interval = setInterval(() => {
        let optionArray = preset.shift();
        if (optionArray[0] == 'name') {
          return;
        }
        that.options[optionArray[0]] = optionArray[1];
        if (preset.length == 0) {
          clearInterval(interval);
        }
      }, 10)
    },
    toggleDescription() {
      if (this.updateDescription) {
        this.description = '';
        this.descriptionData = {};
      }
      this.updateDescription = !this.updateDescription;
    },
    getToggleString(string, value) {
      let toggleString = value ? 'toggle off' : 'toggle on';
      return string.replace('toggle', toggleString)
    }
  }
};

function getDescriptionData () {
   return {
    grid: {name: 'Grid & Players', description: 'Options for grid size, players amount and position. At the bottom of the section you can see the summary.', parts: {
      position: {
        name: 'Players position', 
        description: 'Default players position is when players are positioned symmetrically. Random is for random positions.'
      },
      size: {
        name: 'Grid size', 
        description: 'Sets size of the game map.'
      },
      players: {
        name: 'Players amount', 
        description: 'Players amount is sum of bots and human players amount.'
      },
      humans: {
        name: 'Humans amount', 
        description: 'Humans are real people, playing the game. Set it to 0 if you want to see bots fight, to 1 to fight vs bots, and 2 and more if you want to play with somebody on the same device.'
      },
    }},
    options: {name: 'Game Options', description: 'Game options doesn\'t change game mechanics. They change how game looks or how fast it runs.', parts: {
      gameSpeed: {
        name: 'Game speed', 
        description: 'Sets how long is delay between players turns. Normal is for common games. Instant is good for massive bots fights.'
      },
      betterBorders: {
        name: 'Better borders', 
        description: 'Better borders are connected.'
      },
      optimization: {
        name: 'Maximal optimization', 
        description: 'Nice for massive bots fights.'
      },
      circles: {
        name: 'Blast circles', 
        description: 'Circle when "four" is activated.'
      },
    }},
    rules: {name: 'Game Rules', description: 'Game rules change game mechanics.', parts: {
      homelandDefense: {
        name: 'Homeland defense', 
        description: 'By default player lose when loses all the cells. With this rule you should have at least one cell in your "Home area", otherwise you will lose. Home area is area of 9 cells, where you spawned.'
      },
    }},
    presets: {name: 'Presets', description: 'Use these to set the options.'}
  };

}
</script>

<style scoped></style>
