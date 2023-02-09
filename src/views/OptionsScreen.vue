<template>
  <div id="options">
    <main id="container">
      <div id="options_ui">
        <section>
          <h3>{{ lh('gridAndPlayers') }}</h3>
          <Dropdown
            :label="l('playersPosition')"
            v-model:value="options.playersPosition"
            :options="{'default': l('playersPosition.default'), 'random': l('playersPosition.random')}"
            @mouseover="description = 'grid.position'"
          />
          <fieldset class="slider_holder"
            @mouseover="description = 'grid.size'"
          >
            <legend>{{ l('gridSize') }}</legend>
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
            <legend>{{ l('playersAmount') }}</legend>
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
            <legend>{{ l('humansAmount') }}</legend>
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
          <h3>{{ lh('gameOptions') }}</h3>
          <fieldset class="slider_holder"
            @mouseover="description = 'options.gameSpeed'"
          >
            <legend>{{ l('gameSpeed') }}</legend>
            <VueSlider 
              :data="gameSpeedSlider"
              v-model="options.gameSpeed"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          
          <Checkbox
            @mouseover="description = 'options.betterBorders'"
            :label="l('betterBorders')"
            v-model:checked="options.betterBorders"
          />
          <Checkbox
            @mouseover="description = 'options.optimization'"
            :label="l('maximalOptimization')"
            v-model:checked="options.maxOptimization"
          />
          <Checkbox
            @mouseover="description = 'options.circles'"
            :label="l('blastCircles')"
            v-model:checked="options.boomCircles"
            :class="{'inactive': options.maxOptimization}"
          />
          <Checkbox
            @mouseover="description = 'options.showPointer'"
            :label="l('pointerOnBotTurn')"
            v-model:checked="options.pointerOnBotTurn"
            :class="{'inactive': options.maxOptimization}"
          />  
        </section>
        <section>
          <h3>{{ lh('gameRules') }}</h3>
          <Checkbox
            @mouseover="description = 'rules.homelandDefense'"
            :label="l('homelandDefense')"
            v-model:checked="options.homelandDefense"
          />
        </section>
      </div>
      <div id="options_description">
        <section @mouseover="description = 'presets'" >
          <h3>{{ lh('presets') }}</h3>
          <Dropdown
            :label="l('choosePreset')"
            v-model:value="presetKey"
            :initial-string="l('preset.none')"
            :options="getPresets(true)"
          />
        </section>
        <section id="description">
          <h3
            @click="toggleDescription()"
          >
          {{ lh('description') }}
          <span class="tooltip">{{ getToggleString('Click to toggle description', showDescription) }}</span>
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
        <section id="start_button_container">
          <div id="start_button"
            @click="startGame"
          >
            {{ l('play') }}
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
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
        gameSpeed: '0',
        betterBorders: true,
        maxOptimization: false,
        boomCircles: true,
        homelandDefense: false,
        pointerOnBotTurn: true
      },
      presets: {},
      presetKey: 'hs',
      gameSpeedSlider: this.getSliderData(),
      showDescription: true,
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
      if (!this.showDescription) {
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
    presetKey() {
      this.setPreset()
    },
    maxOptimization() {
      if (this.options.maxOptimization) {
        this.options.boomCircles = false;
        this.options.pointerOnBotTurn = false;
      }
    },
    options: {
      handler() {
        window.localStorage.setItem('options', JSON.stringify(this.options))
      },
      deep: true
    },
    showDescription() {
      window.localStorage.setItem('showDescription', JSON.stringify(this.showDescription))
    }
  },
  mounted() {
    this.presets = getPresetsData()
    for (let [key, value] of Object.entries(this.presets)) {
      this.presets[key].name = this.l('preset.' + key)
    }
    let options = JSON.parse(window.localStorage.getItem('options'))
    if (options) {
      let optionsArray = Object.entries(options);
      let that = this;
      let interval = setInterval(() => {
        let optionArray = optionsArray.shift();
  
        that.options[optionArray[0]] = optionArray[1];
  
        if (optionsArray.length == 0) {
          clearInterval(interval);
        }
      }, 0)
    }
    if (JSON.parse(window.localStorage.getItem('showDescription'))) {
      this.showDescription = JSON.parse(window.localStorage.getItem('showDescription'))
    }
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
        '0': this.l('gameSpeed.normal'),
        '1': this.l('gameSpeed.fast'),
        '2': this.l('gameSpeed.instant')
      }
    },
    getPresets(getDropdownValues = false) {
      if (getDropdownValues) {
        let dropdownValues = {};
        for (let [key, value] of Object.entries(this.presets)) {
          dropdownValues[key] = value['name'];
        }
        return dropdownValues;
      }
      return this.presets;
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
        homelandDefense: false,
        pointerOnBotTurn: false
      };
      this.options = defaultOptions;
      let preset = Object.entries(this.getPresets()[this.presetKey]);
      let that = this;
      let interval = setInterval(() => {
        let optionArray = preset.shift();
        if (preset.length == 0) {
          clearInterval(interval);
        }
        if (optionArray[0] == 'name') {
          return;
        }
        that.options[optionArray[0]] = optionArray[1];
      }, 0)
    },
    toggleDescription() {
      if (this.showDescription) {
        this.description = '';
        this.descriptionData = {};
      }
      this.showDescription = !this.showDescription;
    },
    getToggleString(string, value) {
      let toggleString = value ? 'toggle off' : 'toggle on';
      return string.replace('toggle', toggleString)
    },
    startGame() {
      let options = this.options;
      let settings = {
        gameOptions: {
          betterBorders: options.betterBorders,
          maxOptimization: options.maxOptimization,
          boomCircles: options.boomCircles,
          gameSpeed: options.gameSpeed,
          pointerOnBotTurn: options.pointerOnBotTurn
        },
        gameRules: {
          homeDef: options.homelandDefense
        },
        playersAmount: options.playersAmount,
        gridSize: options.gridSize,
        humansAmount: options.humansAmount,
        playersPosition: options.playersPosition
      };
      setSettings(settings);
      setAppData('shouldSetDefaultSettings', false)
      this.$router.push('/game')
    },
    l(key) {
      return this.$root.getLangString('options.' + key)
    },
    lh(key) {
      return this.$root.getLangString('options.' + key + '.header')
    },
    ld(key) {
      return this.$root.getLangString('options.' + key + '.desc')
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
      showPointer: {
        name: 'Show pointer', 
        description: 'Shows pointer on cell bot made its turn on.'
      }
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
function getPresetsData () {
  return {
    default: {
      pointerOnBotTurn: true
    },
    classic: {
      betterBorders: false,
      boomCircles: false
    },
    duel: {
      playersAmount: 2,
      humansAmount: 2,
      gridSize: 7
    },
    bigBotFight: {
      playersPosition: 'random',
      gridSize: 11,
      playersAmount: 8,
      humansAmount: 0,
      gameSpeed: '1'
    },
    hugeBotFight: {
      playersPosition: 'random',
      gridSize: 15,
      playersAmount: 16,
      humansAmount: 0,
      gameSpeed: '2',
      maxOptimization: true
    },
    homelandDefense: {
      playersPosition: 'random',
      gridSize: 11,
      playersAmount: 4,
      humansAmount: 1,
      gameSpeed: '0',
      homelandDefense: true
    }
  }
}
</script>

<style scoped></style>
