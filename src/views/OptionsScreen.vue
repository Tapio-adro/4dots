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
            @mouseover="description = 'gridAndPlayers.playersPosition'"
          />
          <fieldset class="slider_holder"
            @mouseover="description = 'gridAndPlayers.gridSize'"
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
            @mouseover="description = 'gridAndPlayers.playersAmount'"
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
            @mouseover="description = 'gridAndPlayers.humansAmount'"
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
            {{ getPlayersSummary }} 
            <span class="map_size">
              {{ options.gridSize + ' x ' + options.gridSize }}
            </span>
          </div>
        </section>
        <section>
          <h3>{{ lh('gameOptions') }}</h3>
          <fieldset class="slider_holder"
            @mouseover="description = 'gameOptions.gameSpeed'"
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
            @mouseover="description = 'gameOptions.betterBorders'"
            :label="l('betterBorders')"
            v-model:checked="options.betterBorders"
          />
          <Checkbox
            @mouseover="description = 'gameOptions.maximalOptimization'"
            :label="l('maximalOptimization')"
            v-model:checked="options.maxOptimization"
          />
          <Checkbox
            @mouseover="description = 'gameOptions.blastCircles'"
            :label="l('blastCircles')"
            v-model:checked="options.boomCircles"
            :class="{'inactive': options.maxOptimization}"
          />
          <Checkbox
            @mouseover="description = 'gameOptions.pointerOnBotTurn'"
            :label="l('pointerOnBotTurn')"
            v-model:checked="options.pointerOnBotTurn"
            :class="{'inactive': options.maxOptimization}"
          />  
        </section>
        <section>
          <h3>{{ lh('gameRules') }}</h3>
          <Checkbox
            @mouseover="description = 'gameRules.homelandDefense'"
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
          <span class="tooltip">{{ getDescriptionToggleString() }}</span>
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
    },
    getPlayersSummary() {
      let humansAmount = this.options.humansAmount
      let botsAmount = this.options.playersAmount - this.options.humansAmount
      // return humansAmount + ' ' + botsAmount
      let humansWord, botsWord
      let lang = this.$root.curLang 
      if (lang == 'uk') {
        humansWord = getNounByNumber(humansAmount)
        botsWord = getNounByNumber(botsAmount, true)
      } else {
        humansWord = humansAmount == 1 ? 'human player' : 'human players'
        botsWord = botsAmount == 1 ? 'bot' : 'bots'
      }
      if (humansAmount == 2 && botsAmount == 0) {
        return lang == 'uk' ? 'дуель' : 'duel'
      }
      if (botsAmount == 0) {
        return humansAmount + ' ' + humansWord
      }  
      if (humansAmount == 0) {
        return botsAmount + ' ' + botsWord
      }
      let conjunctionWord = lang == 'uk' ? ' і ' : ' and '
      return humansAmount + ' ' + humansWord + conjunctionWord + botsAmount + ' ' + botsWord
      // if (number == 1) {
      //   return number + ' ' + word
      // }
      // else {
      //   return number + ' ' + word + 's'
      // }
      function getNounByNumber (num, bot = false) {
        if (num == 1) {
          return bot ? 'бот' : 'людина-гравець'
        } else if (num <= 4) {
          return bot ? 'боти' : 'людини-гравця'
        } else {
          return bot ? 'ботів' : 'людей-гравців'
        }
      }
    }
  },
  watch: {
    description() {
      if (!this.showDescription) {
        this.description = '';
        return;
      }

      let descr = {};
      if (this.description == 'presets') {
        descr.sectionName = this.lh('presets');
        descr.sectionDescription = this.ld('presets');
        descr.partName = '';
        descr.partDescription = '';     
        this.descriptionData = descr;
        return;
      }
      let [section, part] = this.description.split('.');
      descr.sectionName = this.lh(section);
      descr.sectionDescription = this.ld(section);
      descr.partName = this.l(part);
      descr.partDescription = this.ld(part);
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
    getDescriptionToggleString() {
      let strStart = this.l('disableDescription.start')
      let strOn = this.l('disableDescription.on')
      let strOff = this.l('disableDescription.off')
      let strEnd = this.l('disableDescription.end')
      let toggleString = !this.showDescription ? strOn : strOff
      return strStart + toggleString + strEnd
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
