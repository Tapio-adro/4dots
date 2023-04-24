const Memorization = {
  data() {
    return {
      dataToMemorize: []
    };
  },
  mounted() {
    for (let key of this.dataToMemorize) {
      if (JSON.parse(localStorage.getItem(key)) !== undefined) {
        this[key] = JSON.parse(localStorage.getItem(key))
      }
      this.$watch(key, (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue))      
      })
    }
  }
};

export default Memorization;
