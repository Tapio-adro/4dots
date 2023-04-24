<template>
  <div id="sidebar_left_container" :class="{open: isSidebarOpen}">
    <div id="sidebar_left" :class="{open: isSidebarOpen}">
      <slot></slot>
    </div>
    <div id="sidebar_left_button" @click="toggleSidebar">
      <i class="fa fa-arrow-right" :class="{open: isSidebarOpen}" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSidebarOpen: false
  },
  emits: ['update:isSidebarOpen'],
  methods: {
    toggleSidebar() {
      this.$emit('update:isSidebarOpen', !this.isSidebarOpen);
    }
  }
};
</script>
