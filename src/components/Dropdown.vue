<template>

<fieldset class="dropdown">
  <legend>{{ label }}</legend>
  <button 
    class="button"
    @click="showDropdownContent = !showDropdownContent"
  >{{ value }}</button>
  <div 
    class="content"
    v-if="showDropdownContent"
  >
    <button 
      v-for="(option, index) in options" :key="index"
      @click="changeValueTo(option)"
    >
      {{ option }}
    </button>
  </div>
</fieldset>

</template>

<script>
export default {
  name: "Dropdown",
  data() {
    return {
      showDropdownContent: false
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
    }
  }
};
</script>