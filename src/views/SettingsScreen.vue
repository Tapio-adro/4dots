<template>
  <div id="settings">
    <main id="container">
      <div id="first_settings_column">
        <section>
          <h3>{{ lh('gridAndPlayers') }}</h3>
          <Dropdown
            :label="l('playersPosition')"
            v-model:value="settings.playersPosition"
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
              v-model="settings.gridSize"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          <fieldset
            class="slider_holder" 
            :class="{'no_slider': settings.maxPlayersAmount == 2}"
            @mouseover="description = 'gridAndPlayers.playersAmount'"
          >
            <legend>{{ l('playersAmount') }}</legend>
            <VueSlider 
              v-if="settings.maxPlayersAmount != 2"
              :min="2"
              :max="settings.maxPlayersAmount"
              :marks="true"
              v-model="settings.playersAmount"
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
              :max="settings.playersAmount"
              :marks="true"
              v-model="settings.humansAmount"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          <Dropdown
            :label="l('botsType')"
            v-model:value="settings.botType"
            :options="botTypes"
            :initialString="this.l('botsType.' + settings.botType)"
            @mouseover="description = 'gridAndPlayers.botsType'"
          />
          <div class="summary">
            {{ getPlayersSummary }} 
            <span class="map_size">
              {{ settings.gridSize + ' x ' + settings.gridSize }}
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
              v-model="settings.gameSpeed"
              :tooltip="'none'"
              :drag-on-click="true"
            />
          </fieldset>
          
          <Checkbox
            @mouseover="description = 'gameOptions.maximalOptimization'"
            :label="l('maximalOptimization')"
            v-model:checked="settings.maxOptimization"
          />
          <Checkbox
            @mouseover="description = 'gameOptions.blastCircles'"
            :label="l('blastCircles')"
            v-model:checked="settings.boomCircles"
            :class="{'inactive': settings.maxOptimization}"
          />
          <Checkbox
            @mouseover="description = 'gameOptions.pointerOnBotTurn'"
            :label="l('pointerOnBotTurn')"
            v-model:checked="settings.pointerOnBotTurn"
            :class="{'inactive': settings.maxOptimization}"
          />  
        </section>
        <section>
          <h3>{{ lh('gameRules') }}</h3>
          <Checkbox
            @mouseover="description = 'gameRules.homelandDefense'"
            :label="l('homelandDefense')"
            v-model:checked="settings.homelandDefense"
          />
        </section>
      </div>
      <div id="second_settings_column">
        <section @mouseover="description = 'presets'" >
          <h3>{{ lh('presets') }}</h3>
          <Dropdown
            :label="l('choosePreset')"
            v-model:value="presetKey"
            :initial-string="l('preset.none')"
            :options="getPresets(true)"
          />
        </section>
        <section>
          <h3>{{ lh('statistics') }}</h3>
          <Checkbox
            @mouseover="description = 'statistics.gatherPlayersData'"
            :label="l('gatherPlayersData')"
            v-model:checked="settings.gatherPlayersData"
          />
          <Checkbox
            @mouseover="description = 'statistics.gatherLinechartsData'"
            :label="l('gatherLinechartsData')"
            v-model:checked="settings.gatherLinechartsData"
            :class="{'inactive': !settings.gatherPlayersData}"
          />
          <!-- <Checkbox
            @mouseover="description = 'statistics.gatherHeatmapData'"
            :label="l('gatherHeatmapData')"
            v-model:checked="settings.gatherHeatmapData"
          /> -->
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
import Memorization from '../mixins/Memorization'

export default {
  name: "SettingsScreen",
  components: {
    VueSlider,
    Dropdown,
    Checkbox
  },
  mixins: [
    Memorization
  ],
  data() { return {
    settings: {
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
    },
    presets: {},
    presetKey: 'hs',
    gameSpeedSlider: this.getSliderData(),
    showDescription: true,
    description: '',
    descriptionData: {},
    botTypesKeys: ['random', 'default', 'powder_keg', 'aggressive'],
    botTypes: {},
    dataToMemorize: ['showDescription']
  }},
  computed: {
    playersAmount() {
      return this.settings.playersAmount;
    },
    maxOptimization() {
      return this.settings.maxOptimization;
    },
    gridSize() {
      return this.settings.gridSize;
    },
    playersPosition() {
      return this.settings.playersPosition;
    },
    getPlayersSummary() {
      let humansAmount = this.settings.humansAmount
      let botsAmount = this.settings.playersAmount - this.settings.humansAmount
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
    },
    gatherPlayersData() {
      return this.settings.gatherPlayersData;
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
      if (!(this.settings.playersAmount < this.settings.humansAmount)) return;
      this.settings.humansAmount = this.settings.playersAmount;
    },
    presetKey() {
      this.setPreset()
    },
    maxOptimization() {
      if (this.settings.maxOptimization) {
        this.settings.boomCircles = false;
        this.settings.pointerOnBotTurn = false;
      }
    },
    gatherPlayersData() {
      if (!this.settings.gatherPlayersData) {
        this.settings.gatherLinechartsData = false;
      }    
    },
    settings: {
      handler() {
        window.localStorage.setItem('settings', JSON.stringify(this.settings))
      },
      deep: true
    }
  },
  mounted() {
    this.presets = getPresetsData()
    for (let [key, value] of Object.entries(this.presets)) {
      this.presets[key].name = this.l('preset.' + key)
    }
    let settings = JSON.parse(window.localStorage.getItem('settings'))
    if (settings) {
      let settingsArray = Object.entries(settings);
      let that = this;
      let interval = setInterval(() => {
        let settingArray = settingsArray.shift();
  
        that.settings[settingArray[0]] = settingArray[1];
  
        if (settingsArray.length == 0) {
          clearInterval(interval);
        }
      }, 0)
    }
    for (let key of this.botTypesKeys) {
      this.botTypes[key] = this.l('botsType.' + key);
    }
  },
  methods: {
    updateMaxPlayersAmount() {
      let playersPosition = this.settings.playersPosition;
      let gridSize = this.settings.gridSize;
      if (playersPosition == 'default') {
        let playersToSize = [
          [5, 2],
          [7, 4],
          [9, 8]
        ]
        if (gridSize > 9) {
          this.settings.maxPlayersAmount = 8
        } else {
          this.settings.maxPlayersAmount = playersToSize.find(elem => elem[0] >= this.settings.gridSize)[1]
        }
      } else {
        let playersToSize = [
        [ 5, 2 ],
        [ 7, 4 ],
        [ 9, 9 ],
        [ 11, 14 ]
        ]
        if (gridSize > 11) {
          this.settings.maxPlayersAmount = 20
        } else {
          this.settings.maxPlayersAmount = playersToSize.find(elem => elem[0] >= this.settings.gridSize)[1]
        }
      }
      if (!(this.settings.maxPlayersAmount < this.settings.playersAmount)) return;
      this.settings.playersAmount = this.settings.maxPlayersAmount;
    },
    getSliderData() {
      return {
        '0': this.l('gameSpeed.slow'),
        '1': this.l('gameSpeed.normal'),
        '2': this.l('gameSpeed.fast'),
        '3': this.l('gameSpeed.instant')
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
      let defaultSettings = {
        playersPosition: 'default',
        gridSize: 9,
        playersAmount: 4,
        maxPlayersAmount: 8,
        humansAmount: 1,
        gameSpeed: '1',
        maxOptimization: false,
        boomCircles: true,
        homelandDefense: true,
        pointerOnBotTurn: true
      };
      for (let [key, value] of Object.entries(defaultSettings)) {
        this.settings[key] = value
      }
      let preset = Object.entries(this.getPresets()[this.presetKey]);
      let that = this;
      let interval = setInterval(() => {
        let settingArray = preset.shift();
        if (preset.length == 0) {
          clearInterval(interval);
        }
        if (settingArray[0] == 'name') {
          return;
        }
        that.settings[settingArray[0]] = settingArray[1];
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
      let settings = this.settings;
      window.localStorage.setItem('globalSettings', JSON.stringify(settings))
      let settingsToSet = {
        gameOptions: {
          maxOptimization: settings.maxOptimization,
          boomCircles: settings.boomCircles,
          gameSpeed: settings.gameSpeed,
          pointerOnBotTurn: settings.pointerOnBotTurn
        },
        gameRules: {
          homeDef: settings.homelandDefense
        },
        gridAndPlayers: {
          playersAmount: settings.playersAmount,
          gridSize: settings.gridSize,
          humansAmount: settings.humansAmount,
          playersPosition: settings.playersPosition,
          botType: settings.botType
        }
      };
      window.localStorage.setItem('settingsToSet', JSON.stringify(settingsToSet))
      setSettings(settingsToSet);
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
      return this.$root.getLangString('settings.' + key)
    },
    lh(key) {
      return this.$root.getLangString('settings.' + key + '.header')
    },
    ld(key) {
      return this.$root.getLangString('settings.' + key + '.desc')
    }
  }
};


function getPresetsData () {
  return {
    default: {},
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
      gameSpeed: '2'
    },
    hugeBotFight: {
      playersPosition: 'random',
      gridSize: 15,
      playersAmount: 16,
      humansAmount: 0,
      gameSpeed: '3',
      maxOptimization: true
    }
  }
}
</script>

<style scoped></style>
