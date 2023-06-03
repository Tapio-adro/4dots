<template>
  <div class="collapsible_section">
    <div class="container">
      <div class="header" @click="toggleCollapsibleSection">
        {{ header }}
        <div class="header_arrow_container">
          <font-awesome-icon
            icon="fa-solid fa-chevron-down"
            class="header_arrow"
            :class="{rotate: !isOpen}"
          />
        </div>
      </div>
      <div class="content" :class="{hidden: !isOpen}">
        <slot>

        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faChevronDown)


export default {
  name: "CollapsibleSection",
  components: {
    FontAwesomeIcon
  },
  props: {
    header: String,
    isOpen: Boolean
  },
  emits: ['update:isOpen'],
  methods: {
    toggleCollapsibleSection() {
      this.$emit('update:isOpen', !this.isOpen);
    }
  },
};
</script>
