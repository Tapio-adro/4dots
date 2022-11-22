<template>

<fieldset class="dropdown">
  <legend>{{ label }}</legend>
  <button 
    class="dropdown_button"
    :class="{active: showDropdownContent}"
    @click="showDropdownContent = !showDropdownContent"
    ref="dropdownButton"
  >
    {{ displayValue }}
    <i class="fa fa-chevron-down" aria-hidden="true"></i>
  </button>
  <div 
    class="content"
    v-if="showDropdownContent"
    v-click-outside="clickOutsideConfig"
  >
    <div 
      class="dropdown_option"
      v-for="[key, option] in Object.entries(options)" :key="key"
      @click="changeValueTo(key, option)"
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
      displayValue: '',
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
    options: Object
  },
  emits: ['update:value'],
  watch: {
    value() {
      this.displayValue = this.options[this.value];
    }
  },
  mounted() {
    if (this.value == 'none') {
      this.displayValue = 'None'
    } else {
      this.displayValue = this.options[this.value];
    }
  },
  methods: {
    changeValueTo(key, option) {
      this.$emit('update:value', key);
      this.displayValue = option;
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