<template>
  <div id="sidebar_left_container" :class="{open: isSidebarOpen}">
    <div id="sidebar_left" :class="{open: isSidebarOpen}" ref="sidebar">
      <slot></slot>
    </div>
    <div id="sidebar_left_button" @click="toggleSidebar" :class="{open: isSidebarOpen}">
      <i class="fa fa-arrow-right" :class="{open: isSidebarOpen}" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    isSidebarOpen: Boolean
  },
  emits: ['update:isSidebarOpen'],
  methods: {
    toggleSidebar() {
      this.$emit('update:isSidebarOpen', !this.isSidebarOpen);
    }
  }
};
</script>
