<template>
  <div class="slider">


    <datalist>
      <option 
        v-for="n in max - min"
        :class="{hiden: !showGaps}"
      ></option>
    </datalist>
  <input 
    ref="input"
    type="range" v-model="rangeValue" min="0" :max="rangeSize" step="1" 
    @input="showGaps = true" 
    @mouseleave="showGaps = false; hoverOver = false"
    @mouseover="hoverOver = true"
  />
  &nbsp;{{  }}

  
  </div>
</template>

<script>

export default {
  name: "OptionsScreen",
  data() {
    return {
      hoverOver: false,
      showGaps: false,
      min: 1,
      max: 10,
      rangeValue: 0,
      rangeSize: 100,
      stepsArray: [],
      value: 0
    }
  },
  methods: {
    snapThumb() {
      if (!this.hoverOver) return;
      console.log('snap');  
      for (let step of this.stepsArray) {
        if (this.rangeValue < step.distance) {
          this.rangeValue = step.distance;
          break;
        } 
      }
    }
  },
  watch: {

  },
  mounted() {
    document.addEventListener('mouseup', this.snapThumb)


    let max = this.max;
    let min = this.min;
    let rangeSize = this.rangeSize;
    let fullParts = max - min - 1;
    let halfParts = 2;
    let segmentSize = rangeSize / (halfParts + fullParts * 2);
    this.stepsArray.push({value: min, distance: segmentSize / 2});
    let rangeLength = 0;
    for (let i = min + 1; i <= max - 1; i++) {
      rangeLength += segmentSize * 2;
      this.stepsArray.push({value: i, distance: rangeLength});
    }
    this.stepsArray.push({value: max, distance: rangeSize - segmentSize / 2});
    console.log(this.stepsArray);
  }
};
</script>

<style scoped></style>
