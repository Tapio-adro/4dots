
<template>
  <div id="settings">
    <header><div>Game settings</div></header>
    <main id="container">
      <div id="settings_ui">
        <section>
          <h3>Grid & Players</h3>
          
          <Slider/>
        </section>
        <section>
          <h3>Game Options</h3>

        </section>
        <section>
          <h3>Game Rules</h3>

        </section>
      </div>
      <div id="settings_description">
        <section>

        </section>
      </div>
    </main>
  </div>
</template>

<script>
import Slider from './Slider.vue'

export default {
  name: "OptionsScreen",
  data() {
    return {
      gui: {

      }
    }
  },
  methods: {

  },
  mounted() {

  },
  components: {
    Slider
  }
};
</script>

<style scoped></style>
