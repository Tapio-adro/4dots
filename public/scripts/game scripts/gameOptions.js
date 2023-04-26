var gameOptions = {
  maxOptimization: {},
  boomCircles: {},
  gameSpeed: {},
  showPointer: function () {},
};

gameOptions.gameSpeed.setGameSpeed = function () {
  let speeds = {
    0: [750, 750],
    1: [500, 200],
    2: [100, 0],
    3: [10, 0],
  };
  gameOptions.gameSpeed.activateFoursSpeed =
    speeds[gameOptionsValues.gameSpeed][0];
  gameOptions.gameSpeed.playerChangeSpeed =
    speeds[gameOptionsValues.gameSpeed][1];
};

gameOptions.boomCircles.spawnBoomCircle = function (cell) {
  if (!gameOptionsValues.boomCircles || gameOptionsValues.maxOptimization)
    return;

  let elemRect = cell.elem.getBoundingClientRect(),
    y = elemRect.y,
    x = elemRect.x;
  let color = "rgb(" + cell.color + ")";

  let circle = document.createElement("div");
  circle.classList.add("boom_circle");

  circle.style.top = y + "px";
  circle.style.left = x + "px";
  circle.style.backgroundColor = color;

  container.appendChild(circle);

  setTimeout(() => {
    circle.classList.add("scale_circle");
  }, 10);

  setTimeout(() => {
    circle.remove();
  }, 3000);
};

gameOptions.maxOptimization.setMaxOptimization = function () {
  if (!gameOptionsValues.maxOptimization) return;

  let root = document.querySelector(":root");

  root.style.setProperty("--cellTransition", "none");
};

gameOptions.showPointerOnBotTurn = function (cell, player) {
  if (!gameOptionsValues.pointerOnBotTurn || player.isHuman) return;

  let elemRect = cell.elem.getBoundingClientRect(),
    y = elemRect.y,
    x = elemRect.x;

  let pointer = document.createElement("div");
  pointer.classList.add("bot_pointer");
  pointer.classList.add("hiden");
  pointer.innerHTML = '<i class="fa fa-hand-pointer-o" aria-hidden="true"></i>';

  pointer.style.top = y + 20 + "px";
  pointer.style.left = x + 13 + "px";
  pointer.style.backgroundColor = color;

  container.appendChild(pointer);

  setTimeout(() => {
    pointer.classList.remove("hiden");
  }, 50);

  setTimeout(() => {
    pointer.classList.add("fade");
    setTimeout(() => {
      pointer.remove();
    }, 500);
  }, 700);
};
