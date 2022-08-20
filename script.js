
let table = document.querySelector('#table');
let container = document.querySelector('#container');

let start_dots = 3;
let curSelection = {'x': -1, 'y': -1};
let cellsCheckSpeed = 500,
    teamChangeSpeed = 200;
let TEAM_COLORS = ['255, 97, 97', '255, 97, 215', '255, 176, 97', '136, 97, 255', 
    '255, 255, 97', '97, 215, 255', '176, 255, 97', '97, 255, 136'].shuffleArray();
var curTeam;
let curTeamIndex;
let cycles = 0;
var curBoomCirclesAmount = 0;
var maxBoomCirclesAmount = 20;
let gamePaused = false;
let gameIsRunnning = true;

let recording = []; 
let doRecording;
let doStatistics;
var maxOptimization;
var gameOptionsValues = {
    betterBorders: 0
};
var gameRulesValues = {
    homeDef: 0
};


// doRecording = true;
// doStatistics = true;

let speedMode = 0;
// maxOptimization = true;

let gridSize = 9;
let playersAmount = 4;
let botsAmount = 4;

let teams, cellsGrid;


setupGridAndTeams();
checkOnStart();

// console.log(teams[0]);
nextTeam(); 
document.addEventListener('keydown', checkKeyInput)

function nextTeam () {
    if (gamePaused) {return;}
    setTimeout(() => {

        checkIsTeams();
        
        let index = getTeamIndex();

        curTeam = index + 1 < teams.length ? 
            teams[index + 1] : teams[0];

        curTeamIndex = index + 1;   

        setContainerColor(curTeam.color);
        curTeam.canDot = true;

        highlightTeam();
        gameRules.homeDef.hideHomeAreaOnPlayerTurn(teams);
    
        checkIfBot();
    }, teamChangeSpeed)
}
function updateGameState () {

    if(!gameIsRunnning) {return;}

    let dotAdded = tryAddDot();

    resetCurrentSelection();

    if (!dotAdded) {return;}

    let fullCells = cellsGrid.findFull();
    let delay = fullCells.length ? cellsCheckSpeed : 0;
    setTimeout(() => {
        checkCellsState();
    }, delay)

    function checkCellsState () {
        let fullCells = cellsGrid.findFull();

        let doCheck = cellsGrid.activateFull(fullCells);



        doCheck ? setTimeout(() => {
            checkCellsState();
        }, cellsCheckSpeed) : 
            (function () {
                gameOptions.betterBorders.updateBorders(cellsGrid);
                if (curTeamIndex == teams.length) {nextCycle();};
                nextTeam();
            })();
    }
}
function tryAddDot () {
    [x, y] = [curSelection.x, curSelection.y];

    let cell = cellsGrid.cell(x, y);
    if (cell && cell.color == curTeam.color) {
        unlightPreviousTeam();
        gameRules.homeDef.showHomeAreaOnPlayerTurn(teams);
        curTeam.canDot = false;
        cell.addDot();
        return true;
    }

    resetCurrentSelection();
    return false;
}


function setupGridAndTeams () {
    teams = createTeams(playersAmount);
    createBots(botsAmount);
    teams = teams.shuffleArray();

    cellsGrid = new Cells(gridSize);
    cellsGrid.setTeams(teams, start_dots, getPlayerCoords(gridSize, playersAmount));
    cellsGrid.createField(table);
}
// on START
function checkOnStart () {
    checkSpeedMode();
    checkMaxOptimization();
    checkStatisticsElems();
    updateStatistics();

    setTimeout(() => {gameRules.homeDef.resizeHomeAreaElements();}, 10)
    
    gameOptions.betterBorders.setStyles();

}

function checkIfBot () {
    if (!curTeam.isPlayer) {

        let botCells = cellsGrid.getByColor(curTeam.color);

        let behaviorTypes = [
            '3_by_3',
            'any_by_free',
            'any_byn_edge',
            'any'
        ]

        let cell;
        for (let behavior of behaviorTypes) {
            cell = cellsGrid.findBotTurn(botCells, behavior);
            if (cell) {
                // console.log(behavior); 
                break;}
        }
        
        curSelection.x = cell.x;
        curSelection.y = cell.y;

        updateGameState();
    }
}

function nextCycle () {
    cycles++;
    updateStatistics();
    updateRecording();
}

function checkIsTeams () {
    gameRules.homeDef.checkHomelands(teams)

    let lostTeams = teams.filter(team => cellsGrid.getByColor(team.color).length == 0);
    if (lostTeams.length != 0) {
        teams = teams.filter(team => cellsGrid.getByColor(team.color).length > 0);

        gameRules.homeDef.removeHomeAreaElement(lostTeams);
    }

    if (teams.length == 1) {
        console.log('game end');
        gameIsRunnning = false;
        updateStatistics();
        playRecording();
    }
}

function checkKeyInput(e) {
    if (e.code == 'Space') {
        if (gamePaused) {
            gamePaused = false;
            nextTeam();
        } else {
            gamePaused = true;
        }
        return;
    }
}
function checkCellClick (e) {
    if (!curTeam.isPlayer || !curTeam.canDot) {return;}

    resetCurrentSelection ();

    let [x, y] = idToCoords(this);

    curSelection.x = x;
    curSelection.y = y;

    updateGameState();
    // cellsGrid.cell(x, y).reset();
    // checkIsTeams();

    function idToCoords(elem) {
        let id = elem.id;
        id = id.substr(1);
        return id.split('_');
    }
}

// functions

function getTeamIndex () {
    let index;
    for (let key in teams) {
        if (teams[key] == curTeam) {
            index = Number(key);
            break;
        }
    }
    return index;
}
function createTeams(amount) {
    let teams = [];
    for (let i = 0; i < amount; i++) {
        teams.push({
            color: TEAM_COLORS.shift(), 
            isPlayer: true,
            canDot: true
        });
        teams[i].colorRGB = 'rgb(' + teams[i].color + ')';
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

function resetCurrentSelection () {
    curSelection.x = -1;
    curSelection.y = -1;
}
function setContainerColor (color) {
    if (maxOptimization) return;
    container.style.borderColor = `rgba(${color}, 0.5)`;
    container.style.backgroundColor = `rgba(${color}, 0.2)`;
}

window.onresize = function() {
   gameRules.homeDef.resizeHomeAreaElements();
}

// OPTIONS -------------------------------------------

// player teams highlighting
function highlightTeam () {
    if (!(curTeam.isPlayer && gameIsRunnning)) return;

    let cells = cellsGrid.getByTeam(curTeam);
    if (!gameOptionsValues.betterBorders) {
        for (let cell of cells) {
            if (!gameOptionsValues.betterBorders) {
                cell.style.borderWidth = '4px';
                cell.style.borderColor = 'orange';
            } 
        } 
    } else {
        gameOptions.betterBorders.highlightTeamBorder(cellsGrid, curTeam, 'orange');
    }
}
function unlightPreviousTeam () {
    if (curTeam && curTeam.isPlayer) {
        if (gameOptionsValues.betterBorders) {
            gameOptions.betterBorders.highlightTeamBorder(cellsGrid, curTeam, curTeam.colorRGB);
        } else {
            let cells = cellsGrid.getByTeam(curTeam);
            for (let cell of cells) {
                cell.setStyle();
            }
        }
    }
}

// recording
function updateRecording (forcedUpdate = false) {
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
function playRecording () {
    if (!doRecording) return;

    updateRecording(true);
    let index = 0;
    let interval = setInterval(function() {
        let array = recording[index++];
        for (let cell of array) {
            cell.setStyle();
            cell.setInner(cell.dots);
            gameOptions.betterBorders.setCellBorder(cell);
        }
        if(index == recording.length){
            clearInterval(interval);
        }
    }, 100)
}
function countTeamsDots () {
    let dotsArray = [];
    for (let team of teams) {
        team.dotsAmount = 0;
        let cells = cellsGrid.getByTeam(team);
        for (let cell of cells) {
            team.dotsAmount += cell.dots;
        }
        dotsArray.push({
            color: team.color,
            amount: team.dotsAmount
        });
    }
    return dotsArray;
}

// statistics
function checkStatisticsElems () {
    if (doStatistics) {
        let elem = document.createElement('div');
        elem.innerHTML = '<div id="dots_stats" class="stats"></div>';
        elem.id = 'statistics';
        let wind = document.querySelector('#window')
        wind.appendChild(elem);
    }
}
function updateStatistics () {
    if(!doStatistics) return;

    let dotsArray = countTeamsDots();
    let dots_stats = document.querySelector('#dots_stats');
    let stDots_cols = document.querySelectorAll('#dots_stats .st_col');
    let stDots_cols_amount = stDots_cols.length;
    let waitTime = 0;

    if (stDots_cols_amount != dotsArray.length) {
        waitTime = 301;
        dots_stats.classList.add('hiden');
        setTimeout(() => {
            dots_stats.innerHTML = '';
            for (let dotsData of dotsArray) {
                let col = document.createElement('div');
                col.classList.add('st_col');
                col.style.backgroundColor = 'rgb(' + dotsData.color + ')';
                dots_stats.appendChild(col);
            }
            stDots_cols = document.querySelectorAll('#dots_stats .st_col');
            dots_stats.classList.remove('hiden');
        }, waitTime - 1)
    } 

    setTimeout(() => {
        let dotsNums = [];
        dotsArray.forEach(el => {
            dotsNums.push(el.amount);
        });
        let max = Math.max(...dotsNums);
        for (let i = 0; i < dotsArray.length; i++) {
            let dotsData = dotsArray[i];
    
            let col = stDots_cols[i];
            col.style.height = (dotsData.amount / max * 100) + '%';
    
        }
    }, waitTime)
}

// max optimiztion
function checkMaxOptimization () {
    if (maxOptimization) {
        let root = document.querySelector(':root');

        root.style.setProperty('--cellTransition', 'none');
    }
}

// boom
function newBoomCircle (x, y, color) {
    curBoomCirclesAmount++;
    let circle = document.createElement('div');
    circle.classList.add('boom_circle');

    circle.style.top = y + 'px';
    circle.style.left = x + 'px';
    circle.style.backgroundColor = color;

    container.appendChild(circle);

    setTimeout(() => {
        circle.classList.add('scale_circle');
    }, 0)

    setTimeout(() => {
        circle.remove();
        curBoomCirclesAmount--;
    }, 2000)
}

// fast mode
function checkSpeedMode () {
    let speeds = {
        0: [500, 200],
        1: [100, 0],
        2: [10, 0]
    }
    cellsCheckSpeed = speeds[speedMode][0];
    teamChangeSpeed = speeds[speedMode][1];
}