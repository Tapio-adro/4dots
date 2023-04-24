<template>

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
