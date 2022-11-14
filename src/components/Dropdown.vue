<template>

<fieldset class="dropdown">
  <legend>{{ label }}</legend>
  <button 
    class="dropdown_button"
    :class="{active: showDropdownContent}"
    @click="showDropdownContent = !showDropdownContent"
    ref="dropdownButton"
  >
    {{ value }}
    <i class="fa fa-chevron-down" aria-hidden="true"></i>
  </button>
  <div 
    class="content"
    v-if="showDropdownContent"
    v-click-outside="clickOutsideConfig"
  >
    <div 
      class="dropdown_option"
      v-for="(option, index) in options" :key="index"
      @click="changeValueTo(option)"
    >
      {{ option }}
    </div>
  </div>
</fieldset>

</template>

<script>
export default {
  name: "Dropdown",
  data() {
    return {
      showDropdownContent: false,
      clickOutsideConfig: {
        handler: this.toggle,
        middleware: this.middleware,
        events: ["dblclick", "click"]
      }
    }
  },
  props: {
    label: String,
    value: String,
    options: Array
  },
  emits: ['update:value'],
  methods: {
    changeValueTo(option) {
      this.$emit('update:value', option)
      this.showDropdownContent = false;
    },
    middleware(event) {
      return event.target != this.$refs.dropdownButton; 
    },
    toggle() {
      this.showDropdownContent = false;
    }
  }
};
</script>