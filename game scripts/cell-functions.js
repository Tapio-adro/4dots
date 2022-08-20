function Cells(size) {
	
	this.size = size;
	this.grid = [];
	this.array = [];
    this.misc = {
        resetBorderWidth: gameOptionsValues.betterBorders ? '1px' : '2px'
    }
    this.modules = {
        betterBorders: {

        }
    }

    for (let x = 0; x < size; x++) {
        this.grid[x] = [];
        for (let y = 0; y < size; y++) {
            let cell = new Cell(x, y, this);

            cell.dots = 0;
            cell.borderColor = 'rgb(64, 64, 64)';
            cell.color = '64, 64, 64';
            cell.link = createLinkFromCoords(cell);
            cell.borderWidth = '2px';

            this.grid[x][y] = cell;
            this.array.push(cell);
        }
    }


    function createLinkFromCoords (cell) {
        let str = 'c' + cell.x + '_' + cell.y;
        return str;
    }

    let middle = (this.size - 1) / 2;
    let edge = this.size - 2;
    Cells.prototype.TEAM__START_COORDS = [
        {x: 1, y: 1},
        {x: edge, y: edge},
        {x: edge, y: 1},
        {x: 1, y: edge},
        {x: 1, y: middle},
        {x: middle, y: edge}, 
        {x: edge, y: middle},
        {x: middle, y: 1}
    ];

    Cells.prototype.BLACK = '64, 64, 64';
    Cells.prototype.AROUND_PLUS = [
        {x: 0, y: -1},
        {x: 0, y: 1},
        {x: -1, y: 0},
        {x: 1, y: 0}
    ];

    Cells.prototype.AROUND_SQUARE_NINE = [
        {x: 0, y: -1},
        {x: 0, y: 1},
        {x: -1, y: 0},
        {x: 1, y: 0},
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: -1, y: -1},
        {x: -1, y: 1},
        {x: 1, y: -1}
    ];
    Cells.prototype.UPDATE_BORDER_CELLS = [
        {x: 0, y: -1},
        {x: 0, y: 1},
        {x: -1, y: 0},
        {x: 1, y: 0},
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: -1, y: -1},
        {x: -1, y: 1},
        {x: 1, y: -1},
        {x: 0, y: 2},
        {x: 0, y: -2},
        {x: 2, y: 0},
        {x: -2, y: 0},
    ];

    Cells.prototype.DOTS_ELEM = '<div class="dot"></div>';
}

Cells.prototype.setTeams = function(teams, start_dots, playersCoords) {
    this.teams = teams;
    playersCoords = (playersCoords ? playersCoords : Cells.prototype.TEAM__START_COORDS).shuffleArray();
    teams.forEach(team => { 
        color = team.color;
        let coords = playersCoords.shift();
        let [x, y] = [coords.x, coords.y];
        let cell = this.cell(x, y);

        cell.borderColor = `rgb(${color})`;
        cell.color = color;
        cell.dots = start_dots;
        cell.borderWidth = gameOptionsValues.betterBorders ? '5px' : '3px';

        team.coreCell = cell;
        team.dotsAmount = start_dots;
        team.cellsAmount = 1;
    });
};

Cells.prototype.cell = function(x, y) {
    let cellExists = checkExistitngCoords(x, y, this.size);
    return cellExists ? this.grid[x][y] : false;


    function checkExistitngCoords(x, y, size) {
        return x >= 0 
            && x <= size - 1
            && y >= 0
            && y <= size - 1;
    }
};

Cells.prototype.createField = function(field) {
    for (let row of this.grid) {
        let tr = document.createElement('tr');

        tr.id = 'r' + row[0].x;

        for (let cell of row) {
            let td = document.createElement('td');

            let tdDiv = document.createElement('div');
            tdDiv.id = cell.link;
            tdDiv.classList.add('cell');
            tdDiv.style.borderColor = cell.borderColor;
            tdDiv.style.borderColor = cell.borderWidth;

            cell.td = tdDiv;
            cell.elem = tdDiv;
            cell.style = tdDiv.style;
            cell.setInner = function (value) {
                tdDiv.innerHTML = '';
                for (let i = 0; i < value; i++) {
                    tdDiv.innerHTML += Cells.prototype.DOTS_ELEM;
                } 
            };
            cell.setInner(cell.dots);
            
            if (cell.color != this.BLACK) {
                cell.setStyle();
            }

            tdDiv.addEventListener('click', checkCellClick);

            td.appendChild(tdDiv);
            tr.appendChild(td);
        }

        field.append(tr);
    }

    gameRules.homeDef.createHomeAreaElements(); 


    // for (let i = 0; i < this.grid.length; i++) {
    //     let row = this.grid[i];
    //     let cell = row[0];
    //     let elem = cell.elem;

    //     let elemRect = elem.getBoundingClientRect(),
    //         y = elemRect.y,
    //         x = elemRect.x;

    //     let numElem = document.createElement('div');
    //     numElem.innerHTML = i;
    //     numElem.classList.add('numbers');
    //     numElem.id = ('rn' + i);

    //     numElem.style.top = y + 'px';
    //     numElem.style.left = x - 75 + 'px';

    //     $('.nums_holder').append(numElem);
    // }
    // for (let i = 0; i < cells.grid[0].length; i++) {
    //     let cell = this.grid[0][i];
    //     let elem = cell.elem;

    //     let elemRect = elem.getBoundingClientRect(),
    //         y = elemRect.y,
    //         x = elemRect.x;

    //     let numElem = document.createElement('div');
    //     numElem.innerHTML = i;
    //     numElem.classList.add('numbers');
    //     numElem.id = ('cn' + i);

    //     numElem.style.top = y - 75 + 'px';
    //     numElem.style.left = x + 'px';

    //     $('.nums_holder').append(numElem);
    // }
};

Cells.prototype.getByColor = function (color, cellsToCheck = false) {
    let cells = [];
    if (!cellsToCheck) {
        cellsToCheck = this.array;
    }
    cellsToCheck.forEach(cell => {
        if (cell.color == color) {
            cells.push(cell);
        }
    });
    return cells;
};
Cells.prototype.getByTeam = function (team) {
    let cells = this.array.filter((cell) => {
        return cell.color == team.color;
    });
    return cells;
};

Cells.prototype.findFull = function () {
    let cells = [];
    for (let cell of this.array) {
        if (cell.dots >= 4) {
            cells.push(cell);
        } 
    }
    return cells;
};

Cells.prototype.activateFull = function (cells) {
    if (cells.length != 0) {
        for (let cell of cells) {
            if (cell.dots == 4) {
                cell.addDotsAround();
                setTimeout(() => {
                    cell.reset();
                }, 10)
            } else {
                cell.dots = cell.dots - 4;
                cell.setStyle();
                cell.setInner(cell.dots);
                cell.addDotsAround(cell);
            }
            if (!maxOptimization && (speedMode != 2 || curBoomCirclesAmount <= maxBoomCirclesAmount)) {
                let elemRect = cell.elem.getBoundingClientRect(),
                y = elemRect.y,
                x = elemRect.x;
                newBoomCircle(x, y, 'rgb(' + cell.color + ')');
            }
            for (let cell2 of cell.cellsAround(Cells.prototype.UPDATE_BORDER_CELLS)) {
                cell2.shouldUpdateBorder = true;
            }
        }

        return true;
    }
};

Cells.prototype.findBotTurn = function(botCells, behavior) {

    let botColor =  botCells[0].color;

    let rivalCells = [];

    for (let cell of this.array) {
        if (cell.color != this.BLACK && cell.color != botColor) {
            rivalCells.push(cell);
        }
    }

    switch (behavior) {
        case '3_by_3':
            botCells = botCells.filter(cell => cell.dots == 3);
            rivalCells = rivalCells.filter(cell => cell.dots == 3);

            for (let botCell of botCells) {
                let cellsAround = botCell.cellsAround();
                for (let cell of cellsAround) {
                    if (rivalCells.includes(cell)) {
                        return botCell;
                    }
                }
            }
            break;
        case 'any_by_free':
            // if (isRivalCellsAround(botCells)) {return false;}

            let chosenBotCells = [];

            botCells = cellsNotAtEdge(botCells);

            findChosenBotCells();

            return getRandomFrom(chosenBotCells);

            function findChosenBotCells() {

                let freeCellsAround = findFreeCellsAround();

                for (let key in freeCellsAround) {
                    let cur = freeCellsAround[key];
                    if (cur >= 2) {
                        chosenBotCells.push(botCells[key]);
                    }
                }
            }

            function findFreeCellsAround() {
                let freeCellsArray = [];
                for (let key in botCells) {
                    let botCell = botCells[key];
                    let freeCells = 0;
                    let cellsAround = botCell.cellsAround();
                    for (let cell of cellsAround) {
                        if (cell.dots == 0) {
                            freeCells++;
                        }
                    }
                    freeCellsArray[key] = freeCells;
                }
                return freeCellsArray;
            }

            function isRivalCellsAround(botCells) {
                for (let botCell of botCells) {
                    let cellsAround = botCell.cellsAround();
                    for (let cell of cellsAround) {
                        if (cell.dots != 0 && cell.color != botCell.color) {
                            return true;
                        }
                    }
                }
                return false;
            }
        case 'any_byn_edge':
            let edge = this.size - 1;
            botCells = cellsNotAtEdge(botCells);
            return getRandomFrom(botCells);
        case 'any':
            return getRandomFrom(botCells);
    }

    return false;

    function getRandomFrom(arr) {
        if (arr.length != 0) {
            return arr[Math.floor(Math.random() * arr.length)];
        } else {
            return false;
        }
    }

    function cellsNotAtEdge(cells) {
        let edge = cells[0].cells.size - 1;
        return cells.filter(cell => 
            cell.x != 0
            && cell.y != 0
            && cell.x != edge
            && cell.y != edge);
    }
};

Cell.prototype.addDotsAround = function () {
    let cellsPairs = this.cellsAroundWithParent();
    for (let cell of cellsPairs.cells) {
        cell.addDot(cellsPairs.parent);
    }
};


function Cell(x, y, cells) {
	this.x = x;
	this.y = y;
	this.cells = cells;
    this.isNeutral = false;
}

Cell.prototype.cellsAround = function(coordsArray = this.cells.AROUND_PLUS) {
    let cellsAround = [];
    for (let coords of coordsArray) {
        let thisX = this.x + coords.x;
        let thisY = this.y + coords.y;
        let cell = this.cells.cell(thisX, thisY);
        if (cell) {
            cellsAround.push(cell);
        }
    }
    return cellsAround;
};

Cell.prototype.reset = function (toNeutral = false) {
    if (toNeutral) {
        this.isNeutral = true;
        this.color = '140, 140, 140';
        this.elem.style.padding = '5px';
    } else {
        this.dots = 0;
        this.setInner(this.dots);
        this.color = this.cells.BLACK;
    }
    this.borderWidth = this.cells.misc.resetBorderWidth;
    this.borderColor = 'rgb(' + this.cells.BLACK + ')';
    this.setStyle();
};

Cell.prototype.setStyle = function () {
    let op = this.dots ? (0.5 + 0.5 * this.dots / 4) : 0;
    let fillColor = `rgba(${this.color}, ${op})`;
    this.elem.style.backgroundColor = fillColor;
    this.elem.style.borderColor = this.borderColor;
    this.elem.style.borderWidth = this.borderWidth;
};

Cell.prototype.cellsAroundWithParent = function() {
    let result = {cells: [], parent: this};

    let x = this.x;
    let y = this.y;
    let cells = this.cells;

    for (let coords of cells.AROUND_PLUS) {
        let thisX = x + coords.x;
        let thisY = y + coords.y;

        if (cells.cell(thisX, thisY)) {
            result.cells.push(cells.cell(thisX, thisY));
        }
    }
    return result;
};

Cell.prototype.addDot = function (cellParent) {
    if (this.isNeutral) {
        this.dots--;
        if (this.dots == 0) {
            this.elem.style.padding = '0px';
            this.isNeutral = false;
            this.reset();
        } 
        this.setInner(this.dots);
        this.setStyle();
        return;
    }

    this.borderColor = cellParent ?
        cellParent.borderColor : this.borderColor;
    this.color = cellParent ?
        cellParent.color : this.color;
    this.borderWidth = cellParent ?
        cellParent.borderWidth : this.borderWidth;

    this.dots++;

    this.setInner(this.dots);
    this.setStyle();
    if (this.dots <= 3) {
        gameOptions.betterBorders.setCellBorder(this);
    }
};

Cell.prototype.checkColor = function (color) {
    return this.color == color;
};

