let table = document.querySelector("#table");
let container = document.querySelector(".wrapper .container");

var gameFieldWidth, gameFieldHeight;

let startDots = 3;
let curSelection = { x: -1, y: -1 };

var curPlayer;
let curPlayerIndex = 0;
let curPlayerColor = '';
let cycles = 0;
let gamePaused = false;
let gameIsRunning = true;
let botBehavior = []

let recording = [];
let doRecording;
let doStatistics;
// doRecording = true;
// doStatistics = true;
var gameOptionsValues = {
  maxOptimization: 0,
  boomCircles: 1,
  gameSpeed: 1,
  pointerOnBotTurn: 1
};
var gameRulesValues = {
  homeDef: 0,
};
var gridAndPlayersValues = {
  gridSize: 5,
  playersAmount: 2,
  playersPosition: 'default',
  botsAmount: 2,
  botType: 'default'
}
var statisticsValues = {
  gatherPlayersData: true,
  gatherLinechartsData: true,
  gatherHeatmapData: true
}
let appData = {
  lang: ''
};

let players, cellsGrid;
document.addEventListener("keydown", checkKeyInput);

// engine functions
function nextPlayer() {
  if (gamePaused) {
    return;
  }
  setTimeout(() => {
    let gameEnded = checkPlayers();
    if (gameEnded) return;

    curPlayerIndex = curPlayerIndex + 1 < players.length && curPlayerIndex != -1 ? curPlayerIndex + 1 : 0
    curPlayerColor = players[curPlayerIndex].color
    
    curPlayer = players[curPlayerIndex];

    setContainerColor(curPlayer.color);
    curPlayer.canDot = true;

    highlightPlayer();

    tryBotTurn();
  }, gameOptions.gameSpeed.playerChangeSpeed);
}
function updateGameState() {
  if (!gameIsRunning) {
    return;
  }

  let dotAdded = tryAddDot();

  resetCurrentSelection();

  if (!dotAdded) {
    return;
  }

  let fullCells = cellsGrid.findFours();
  let delay = fullCells.length ? gameOptions.gameSpeed.activateFoursSpeed : 0;
  setTimeout(() => {
    checkCellsState();
  }, delay);

  function checkCellsState() {
    let fullCells = cellsGrid.findFours();

    let doCheck = cellsGrid.activateFours(fullCells);

    if (doCheck) {
      setTimeout(() => {
        checkCellsState();
      }, gameOptions.gameSpeed.activateFoursSpeed)
    } else {
      gameFeatures.betterBorders.updateBorders(cellsGrid);
      if (curPlayerIndex == 0) {
        passPlayersData(statistics.getPlayersData(cellsGrid, players));
      }
      if (curPlayerIndex + 1 == players.length) {
        nextCycle();
      }
      nextPlayer();
    }
  }
}
// other main functions
function tryBotTurn() {
  if (!curPlayer.isHuman) {

    let cell = gameFeatures.getBotTurn(cellsGrid, curPlayer.color, botBehavior);

    curSelection.x = cell.x;
    curSelection.y = cell.y;

    updateGameState();
  }
}

function tryAddDot() {
  [x, y] = [curSelection.x, curSelection.y];
  let cell = cellsGrid.cell(x, y);
  if (cell && cell.color == curPlayer.color) {
    gameOptions.showPointerOnBotTurn(cell, curPlayer);
    unlightPreviousPlayer();
    curPlayer.canDot = false;
    cell.addDot();
    return true;
  }

  resetCurrentSelection();
  return false;
}
function checkCellClick() {
  if (!curPlayer.isHuman || !curPlayer.canDot) {
    return;
  }

  resetCurrentSelection();

  let [x, y] = idToCoords(this);

  curSelection.x = x;
  curSelection.y = y;

  updateGameState();
  // cellsGrid.cell(x, y).reset();
  // checkIsHumans();

  function idToCoords(elem) {
    let id = elem.id;
    id = id.substr(1);
    return id.split("_");
  }
}
function checkKeyInput(e) {
  if (e.code == "Space") {
    if (gamePaused) {
      gamePaused = false;
      nextPlayer();
    } else {
      gamePaused = true;
    }
    return;
  }
}

function checkPlayers() {
  gameRules.homeDef.checkHomelands(players);

  let lostPlayers = players.filter(
    (player) => cellsGrid.getByColor(player.color).length == 0
  );
  if (lostPlayers.length != 0) {
    // for (let player of lostPlayers) {
    //   let messagesDiv = document.querySelector('#messages');
    //   let message = document.createElement('div');
    //   message.innerHTML = player.isHuman ? 'Player lost' : 'Enemy lost';
    //   message.style.color = player.colorRGB;
    //   messagesDiv.appendChild(message);
    // }

    players = players.filter((player) => cellsGrid.getByColor(player.color).length > 0);

    for (let key in players) {
      if (players[key].color == curPlayerColor) {
        curPlayerIndex = Number(key);
        break;
      }
    }

    gameRules.homeDef.removeHomeAreaElement(lostPlayers);
  }

  if (players.length == 1) {
    passPlayersData(statistics.getPlayersData(cellsGrid, players));
    gameIsRunning = false;
    gameFeatures.showWinner(curPlayer, appData.lang)
    document.querySelector('#go_back_button').classList.add('highlight');
    updateStatistics();
    playRecording();
  }

  return players.length == 1
}

// global functions
function getAppData (key) {
  return appData[key];
}
function setAppData(key, value) {
  appData[key] = value;
}
function setSettings(settings) {
  for (let [key, value] of Object.entries(settings.gridAndPlayers)) {
    gridAndPlayersValues[key] = value;
  }
  for (let [key, value] of Object.entries(settings.gameOptions)) {
    gameOptionsValues[key] = value;
  }
  for (let [key, value] of Object.entries(settings.gameRules)) {
    gameRulesValues[key] = value;
  }
  gridAndPlayersValues.botsAmount = gridAndPlayersValues.playersAmount - gridAndPlayersValues.humansAmount
}

// init functions
function startGame() {
  runWithInterval([
    resetData,
    setupGridAndPlayers,
    checkOnStart,
    nextPlayer
  ], 10)
}
function checkOnStart() {
  botBehavior = getBotBehavior(gridAndPlayersValues.botType);

  curPlayerColor = players[0].color
  gameOptions.gameSpeed.setGameSpeed();
  gameOptions.maxOptimization.setMaxOptimization();
  checkStatisticsElems();
  updateStatistics();

  gameFeatures.betterBorders.setStyles();

  assignWidthAndHeight();

  gameRules.homeDef.createHomeAreaElements();
  setTimeout(() => {
    gameFeatures.scaleGameElements();
    gameRules.homeDef.resizeHomeAreaElements();
    gameRules.homeDef.resizeHomeAreaElements();
  }, 0);

  setTimeout(() => {
    document.querySelector('#window').classList.remove('hidden');
  }, 300)

  passPlayersData(statistics.getPlayersData(cellsGrid, players));
}
function setupGridAndPlayers() {
  table = document.querySelector("#table");
  container = document.querySelector(".wrapper .container");

  let playerColors = gameFeatures.getPlayerColors(gridAndPlayersValues.playersAmount).shuffleArray();
  players = createPlayers(gridAndPlayersValues.playersAmount, playerColors);
  createBots(gridAndPlayersValues.botsAmount);
  players = players.shuffleArray();

  cellsGrid = new Cells(gridAndPlayersValues.gridSize);
  cellsGrid.setPlayers(
    players,
    startDots,
    gridAndPlayersValues.playersPosition
  );
  cellsGrid.createField(table);
}
function createPlayers(amount, colors) {
  let players = [];
  for (let i = 0; i < amount; i++) {
    let [color, invertedColor] = colors.shift();
    players.push({
      color: color,
      isHuman: true,
      canDot: true,
      highlightColor: `rgb(${invertedColor})`,
    });
    players[i].colorRGB = `rgb(${players[i].color})`;
  }
  return players;
}
function createBots(botsAmount) {
  let bots = [];
  for (let i = 0; i < botsAmount; i++) {
    bots[i] = players[i].color;
    players[i].isHuman = false;
  }
  return bots;
}

function resetData () {
  curSelection = { x: -1, y: -1 };

  curPlayer = {};
  curPlayerIndex = 0;
  cycles = 0;
  gamePaused = false;
  gameIsRunning = true;

  players = [];
  cellsGrid = {};

  document.querySelector('#table').innerHTML = '';
}

// utility functions
function nextCycle() {
  cycles++;
  updateStatistics();
  updateRecording();
}
function resetCurrentSelection() {
  curSelection.x = -1;
  curSelection.y = -1;
}
function setContainerColor(color) {
  if (gameOptionsValues.maxOptimization) return;
  container.style.borderColor = `rgba(${color}, 0.5)`;
  container.style.backgroundColor = `rgba(${color}, 0.2)`;
}
function assignWidthAndHeight () {
  let container = document.querySelector('.wrapper .container');

  // if (screen.orientation.type == 'portrait-primary') {
  //   container = document.querySelector('.wrapper #table');
  //   screen.orientation.lock('landscape');
  //   document.querySelector('.wrapper .container').classList.add('no_border_radius');
  // }

  gameFieldHeight = container.offsetHeight;
  gameFieldWidth = container.offsetWidth;
}
function runWithInterval (functionsArray, time) {
  let interval = setInterval(() => {
    let function1 = functionsArray.shift();
    function1();
    if(functionsArray.length == 0) {
      clearInterval(interval)
    }
  }, time)
}
function highlightPlayer() {
  if (!(curPlayer.isHuman && gameIsRunning)) return;

  gameFeatures.betterBorders.highlightPlayerBorder(
    cellsGrid,
    curPlayer,
    curPlayer.highlightColor
  );
}
function unlightPreviousPlayer() {
  if (curPlayer && curPlayer.isHuman) {
    gameFeatures.betterBorders.highlightPlayerBorder(
      cellsGrid,
      curPlayer,
      curPlayer.colorRGB
    );
  }
}
function passPlayersData(data) {
  const event = new CustomEvent("passPlayersData", { detail: data });
  dispatchEvent(event);
};
function getBotBehavior (botType) {
  return {
    'random': ['any'],
    'default': ['3_by_3', 'any_by_free', 'any_byn_edge', 'any'],
    'powder_keg': ['3_by_3', 'less_than_2', 'any_byn_edge', 'any'],
    'aggressive': ['3_by_3', 'bigger_by_smaller', 'get_closer_to_enemy', 'dot_inside', 'any_byn_edge', 'any'],
    'smart': []
  }[botType]
}

// when window is resized
window.onresize = function () {
  if (appData.curWindow != 'game') return;
  gameFeatures.scaleGameElements();
  gameRules.homeDef.resizeHomeAreaElements();
};

// recording
function updateRecording(forcedUpdate = false) {
  if (!doRecording) return;

  if (cycles % 1 == 0 || forcedUpdate) {
    let step = copyCellsArray(cellsGrid.array);
    recording.push(step);
  }

  function copyCellsArray(array) {
    let arrayCopy = [];
    for (let cell of array) {
      let cellCopy = new Cell();
      for (let [key, value] of Object.entries(cell)) {
        cellCopy[key] = value;
      }
      arrayCopy.push(cellCopy);
    }
    return arrayCopy;
  }
}
function playRecording() {
  if (!doRecording) return;

  updateRecording(true);
  let index = 0;
  let interval = setInterval(function () {
    let array = recording[index++];
    for (let cell of array) {
      cell.setStyle();
      cell.setInner(cell.dots);
      gameFeatures.betterBorders.setCellBorder(cell);
    }
    if (index == recording.length) {
      clearInterval(interval);
    }
  }, 100);
}

// statistics
function checkStatisticsElems() {
  if (doStatistics) {
    let elem = document.createElement("div");
    elem.innerHTML = '<div id="dots_stats" class="stats"></div>';
    elem.id = "statistics";
    let wind = document.querySelector("#window");
    wind.appendChild(elem);
  }
}
function updateStatistics() {
  if (!doStatistics) return;

  let dotsArray = countPlayersDots();
  let dots_stats = document.querySelector("#dots_stats");
  let stDots_cols = document.querySelectorAll("#dots_stats .st_col");
  let stDots_cols_amount = stDots_cols.length;
  let waitTime = 0;

  if (stDots_cols_amount != dotsArray.length) {
    waitTime = 301;
    dots_stats.classList.add("hidden");
    setTimeout(() => {
      dots_stats.innerHTML = "";
      for (let dotsData of dotsArray) {
        let col = document.createElement("div");
        col.classList.add("st_col");
        col.style.backgroundColor = "rgb(" + dotsData.color + ")";
        dots_stats.appendChild(col);
      }
      stDots_cols = document.querySelectorAll("#dots_stats .st_col");
      dots_stats.classList.remove("hidden");
    }, waitTime - 1);
  }

  setTimeout(() => {
    let dotsNums = [];
    dotsArray.forEach((el) => {
      dotsNums.push(el.amount);
    });
    let max = Math.max(...dotsNums);
    for (let i = 0; i < dotsArray.length; i++) {
      let dotsData = dotsArray[i];

      let col = stDots_cols[i];
      col.style.height = (dotsData.amount / max) * 100 + "%";
    }
  }, waitTime);
}
function countPlayersDots() {
  let dotsArray = [];
  for (let player of players) {
    player.dotsAmount = 0;
    let cells = cellsGrid.getByPlayer(player);
    for (let cell of cells) {
      player.dotsAmount += cell.dots;
    }
    dotsArray.push({
      color: player.color,
      amount: player.dotsAmount,
    });
  }
  return dotsArray;
}

