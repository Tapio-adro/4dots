<template>
  <div id="sidebar_left_container" :class="{open: sidebarOpen}">
    <div id="sidebar_left" :class="{open: sidebarOpen}">
      <slot></slot>
    </div>
    <div id="sidebar_left_button" @click="toggleSidebar">
      <i class="fa fa-arrow-right" :class="{open: sidebarOpen}" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sidebarOpen: true
    };
  },
  methods: {
    toggleSidebar() {
      console.log('click');
      this.sidebarOpen = !this.sidebarOpen;
    },
  }
};
</script>
