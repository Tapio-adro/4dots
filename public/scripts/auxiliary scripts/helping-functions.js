prototypeFunction(Array, "shuffleArray", function () {
  let result = [];
  while (this.length != 0) {
    result.push(...this.splice(random(this), 1));
  }
  return result;

  function random(arr) {
    return Math.floor(Math.random() * arr.length);
  }
});
prototypeFunction(Array, "randomElement", function () {
  if (this.length != 0) {
    return this[Math.floor(Math.random() * this.length)];
  } else {
    return false;
  }
});
prototypeFunction(Array, "randomIndex", function () {
  return Math.floor(Math.random() * this.length);
});

function prototypeFunction(type, name, func) {
  Object.defineProperty(type["prototype"], name, {
    value: func,
  });
}
