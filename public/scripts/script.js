let table = document.querySelector("#table");
let container = document.querySelector(".container");

var gameFieldWidth, gameFieldHeight;

let start_dots = 3;
let curSelection = { x: -1, y: -1 };

var curTeam;
let curTeamIndex = null;
let cycles = 0;
let gamePaused = false;
let gameIsRunning = true;

let recording = [];
let doRecording;
let doStatistics;
// doRecording = true;
// doStatistics = true;
var gameOptionsValues = {
  betterBorders: 1,
  maxOptimization: 0,
  boomCircles: 1,
  gameSpeed: 2,
  pointerOnBotTurn: 1
};
var gameRulesValues = {
  homeDef: 1,
};
let appData = {
  curWindow: '',
  shouldSetDefaultSettings: true,
  devMode: 0,
  lastWindow: 'home',
  lang: ''
};

let gridSize = 5;
let playersAmount = 4;
let playersPosition;
let botsAmount = 3;


let teams, cellsGrid;
document.addEventListener("keydown", checkKeyInput);

// engine functions
function nextTeam() {
  if (gamePaused) {
    return;
  }
  setTimeout(() => {
    checkTeams();

    let index = getTeamIndex();

    curTeam = index + 1 < teams.length ? teams[index + 1] : teams[0];

    curTeamIndex = index + 1;

    setContainerColor(curTeam.color);
    curTeam.canDot = true;

    highlightTeam();
    gameRules.homeDef.hideHomeAreaOnPlayerTurn(teams);

    tryBotTurn();
  }, gameOptions.gameSpeed.teamChangeSpeed);
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

    doCheck
      ? setTimeout(() => {
          checkCellsState();
        }, gameOptions.gameSpeed.activateFoursSpeed)
      : (function () {
          gameOptions.betterBorders.updateBorders(cellsGrid);
          if (curTeamIndex == teams.length) {
            nextCycle();
          }
          nextTeam();
        })();
  }
}
let botTypes = {
  'random': ['any_byn_edge', 'any'],
  'default': ['3_by_3', 'any_by_free', 'any_byn_edge', 'any'],
  'powder_keg': ['3_by_3', 'less_than_2', 'any_byn_edge', 'any'],
  'aggressive': ['3_by_3', 'bigger_by_smaller', 'any_byn_edge', 'any'],
  'smart': [],
}
// other main functions
function tryBotTurn() {
  if (!curTeam.isPlayer) {

    let behaviorTypes = botTypes['default'];

    let cell = gameFeatures.getBotTurn(cellsGrid, curTeam.color, behaviorTypes);

    curSelection.x = cell.x;
    curSelection.y = cell.y;

    updateGameState();
  }
}

function tryAddDot() {
  [x, y] = [curSelection.x, curSelection.y];
  let cell = cellsGrid.cell(x, y);
  if (cell && cell.color == curTeam.color) {
    gameOptions.showPointerOnBotTurn(cell, curTeam);
    unlightPreviousTeam();
    gameRules.homeDef.showHomeAreaAfterPlayerTurn(teams);
    curTeam.canDot = false;
    cell.addDot();
    return true;
  }

  resetCurrentSelection();
  return false;
}
function checkCellClick() {
  if (!curTeam.isPlayer || !curTeam.canDot) {
    return;
  }

  resetCurrentSelection();

  let [x, y] = idToCoords(this);

  curSelection.x = x;
  curSelection.y = y;

  updateGameState();
  // cellsGrid.cell(x, y).reset();
  // checkIsTeams();

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
      nextTeam();
    } else {
      gamePaused = true;
    }
    return;
  }
}

function checkTeams() {
  gameRules.homeDef.checkHomelands(teams);

  let lostTeams = teams.filter(
    (team) => cellsGrid.getByColor(team.color).length == 0
  );
  if (lostTeams.length != 0) {
    // for (let team of lostTeams) {
    //   let messagesDiv = document.querySelector('#messages');
    //   let message = document.createElement('div');
    //   message.innerHTML = team.isPlayer ? 'Player lost' : 'Enemy lost';
    //   message.style.color = team.colorRGB;
    //   messagesDiv.appendChild(message);
    // }
    teams = teams.filter((team) => cellsGrid.getByColor(team.color).length > 0);

    gameRules.homeDef.removeHomeAreaElement(lostTeams);
  }

  if (teams.length == 1) {
    console.log("game end");
    gameIsRunning = false;
    gameFeatures.showWinner(curTeam, appData.lang)
    document.querySelector('#go_back_button').classList.add('highlight');
    updateStatistics();
    playRecording();
  }
}

// global functions
function getAppData (key) {
  return appData[key];
}
function setAppData(key, value) {
  appData[key] = value;
}
function setSettings(settings) {
  gridSize = settings.gridSize;
  playersAmount = settings.playersAmount;
  botsAmount = playersAmount - settings.humansAmount;
  playersPosition = settings.playersPosition == 'random' ? getPlayerCoords(gridSize, playersAmount) : false;
  for (let [key, value] of Object.entries(settings.gameOptions)) {
    gameOptionsValues[key] = value;
  }
  for (let [key, value] of Object.entries(settings.gameRules)) {
    gameRulesValues[key] = value;
  }
}

// init functions
function startGame() {
  runWithInterval([
    resetData,
    setupGridAndTeams,
    checkOnStart,
    nextTeam
  ], 10)
}
function checkOnStart() {
  gameOptions.gameSpeed.setGameSpeed();
  gameOptions.maxOptimization.setMaxOptimization();
  checkStatisticsElems();
  updateStatistics();

  assignWidthAndHeight();

  gameRules.homeDef.createHomeAreaElements();
  setTimeout(() => {
    gameFeatures.scaleGameElements();
    gameRules.homeDef.resizeHomeAreaElements();
    gameRules.homeDef.resizeHomeAreaElements();
  }, 0);

  gameOptions.betterBorders.setStyles();

  setTimeout(() => {
    document.querySelector('#window').classList.remove('hiden');
  }, 300)
}
function setupGridAndTeams() {
  table = document.querySelector("#table");
  container = document.querySelector(".container");

  let teamColors = gameFeatures.getTeamColors(playersAmount).shuffleArray();
  teams = createTeams(playersAmount, teamColors);
  createBots(botsAmount);
  teams = teams.shuffleArray();

  cellsGrid = new Cells(gridSize);
  cellsGrid.setTeams(
    teams,
    start_dots,
    playersPosition
  );
  cellsGrid.createField(table);
}
function createTeams(amount, colors) {
  let teams = [];
  for (let i = 0; i < amount; i++) {
    let [color, invertedColor] = colors.shift();
    teams.push({
      color: color,
      isPlayer: true,
      canDot: true,
      highlightColor: `rgb(${invertedColor})`,
    });
    teams[i].colorRGB = `rgb(${teams[i].color})`;
  }
  return teams;
}
function createBots(botsAmount) {
  let bots = [];
  for (let i = 0; i < botsAmount; i++) {
    bots[i] = teams[i].color;
    teams[i].isPlayer = false;
  }
  return bots;
}

function resetData () {
  curSelection = { x: -1, y: -1 };

  curTeam = {};
  curTeamIndex = null;
  cycles = 0;
  gamePaused = false;
  gameIsRunning = true;

  teams = [];
  cellsGrid = {};

  document.querySelector('#table').innerHTML = '';
}

// utility functions
function getTeamIndex() {
  let index;
  for (let key in teams) {
    if (teams[key] == curTeam) {
      index = Number(key);
      break;
    }
  }
  return index;
}
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
  let container = document.querySelector('.wrapper .outer_container');

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
function highlightTeam() {
  if (!(curTeam.isPlayer && gameIsRunning)) return;

  gameOptions.betterBorders.highlightTeamBorder(
    cellsGrid,
    curTeam,
    curTeam.highlightColor
  );

  if (gameOptionsValues.betterBorders) return;

  let cells = cellsGrid.getByTeam(curTeam);
  for (let cell of cells) {
    if (!gameOptionsValues.betterBorders) {
      cell.style.borderWidth = "4px";
      cell.style.borderColor = curTeam.highlightColor;
    }
  }
}
function unlightPreviousTeam() {
  if (curTeam && curTeam.isPlayer) {
    if (gameOptionsValues.betterBorders) {
      gameOptions.betterBorders.highlightTeamBorder(
        cellsGrid,
        curTeam,
        curTeam.colorRGB
      );
    } else {
      let cells = cellsGrid.getByTeam(curTeam);
      for (let cell of cells) {
        cell.setStyle();
      }
    }
  }
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
      gameOptions.betterBorders.setCellBorder(cell);
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

  let dotsArray = countTeamsDots();
  let dots_stats = document.querySelector("#dots_stats");
  let stDots_cols = document.querySelectorAll("#dots_stats .st_col");
  let stDots_cols_amount = stDots_cols.length;
  let waitTime = 0;

  if (stDots_cols_amount != dotsArray.length) {
    waitTime = 301;
    dots_stats.classList.add("hiden");
    setTimeout(() => {
      dots_stats.innerHTML = "";
      for (let dotsData of dotsArray) {
        let col = document.createElement("div");
        col.classList.add("st_col");
        col.style.backgroundColor = "rgb(" + dotsData.color + ")";
        dots_stats.appendChild(col);
      }
      stDots_cols = document.querySelectorAll("#dots_stats .st_col");
      dots_stats.classList.remove("hiden");
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
function countTeamsDots() {
  let dotsArray = [];
  for (let team of teams) {
    team.dotsAmount = 0;
    let cells = cellsGrid.getByTeam(team);
    for (let cell of cells) {
      team.dotsAmount += cell.dots;
    }
    dotsArray.push({
      color: team.color,
      amount: team.dotsAmount,
    });
  }
  return dotsArray;
}

