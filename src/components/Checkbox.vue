<template>

<div class="checkbox_wrapper">
<label 
    class="checkbox"
  >
  <input type="checkbox" v-model="checked"/>
  <span>{{ label }}</span>
</label>
</div>

</template>

<script>
export default {
  name: "Checkbox",
  props: {
    label: String,
    checked: Boolean,
  },
  emits: ['update:checked'],
  watch: {
    checked() {
      this.$emit('update:checked', this.checked);
    }
  }
};
</script>