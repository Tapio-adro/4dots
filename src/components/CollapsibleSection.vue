<template>
  <div class="collapsible_section">
    <div class="container">
      <div class="header">{{ header }}</div>
      <div class="content">
        <slot>

        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: String
  },
  methods: {

  }
};
</script>
