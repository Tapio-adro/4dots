<template>
  <div id="options">
    <header><div>Game options</div></header>
    <main id="container">
      <div id="options_ui">
        <section>
          <h3>Grid & Players</h3>
          <fieldset>
            <legend>Grid size</legend>
            <vue-slider 
              :min="5"
              :max="21"
              :interval="2"
              :marks="true"
              v-model="options.gridSize"
              :tooltip="'none'"
              :drag-on-click="true"
            ></vue-slider>
          </fieldset>
          <fieldset>
            <legend>Players amount</legend>
            <vue-slider 
              :min="5"
              :max="21"
              :marks="true"
              v-model="options.gridSize"
              :tooltip="'none'"
              :drag-on-click="true"
            ></vue-slider>
          </fieldset>
          <br>
          
          <br>
          humans amount

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

export default {
  name: "OptionsScreen",
  data() {
    return {
      options: {
        gridSize: 9,
      }
    }
  },
  components: {
    VueSlider
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped></style>
