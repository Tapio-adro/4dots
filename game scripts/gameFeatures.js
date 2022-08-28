var gameFeatures = {
  ScaleGameElements: function() {}
}

gameFeatures.ScaleGameElements = function () {
  let root = document.querySelector(':root');
  let wrapper = document.querySelector('#wrapper');

  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;

  let rect = wrapper.getBoundingClientRect();

  let zoomLevel;

  if (windowWidth > windowHeight) {
    zoomLevel = windowHeight / rect.height;
  } else {
    zoomLevel = windowWidth / rect.width;
    console.log(zoomLevel);
  }

  root.style.setProperty('--zoomLevel', zoomLevel);
}