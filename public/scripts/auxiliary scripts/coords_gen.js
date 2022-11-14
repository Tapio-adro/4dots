let SYMBOLS = {
  empty: "+",
  add: "0",
  core: "#",
  player: "p",
};
let SYM_RANKS = {};
let symArr = Object.values(SYMBOLS);
for (let i = 0; i < symArr.length; i++) {
  let sym = symArr[i];
  SYM_RANKS[sym] = i;
}

let Grid = function (size, symEmpty, symCore) {
  this.size = size;
  this.grid = [];

  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push(
        i == 0 || j == 0 || i + 1 == size || j + 1 == size ? symCore : symEmpty
      );
    }
    this.grid.push(row);
  }
  if (size == 5) {
    this.grid[2][2] = '#'
  }
};
Grid.prototype.changeCells = function (coordsArr, symbol) {
  let size = this.size;
  for (let cd of coordsArr) {
    if (checkCoords(cd) && checkRanks(this.cell(cd.x, cd.y), symbol)) {
      this.grid[cd.y][cd.x] = symbol;
    }
  }
  function checkRanks(oldSym, newSym) {
    return SYM_RANKS[newSym] > SYM_RANKS[oldSym];
  }
  function checkCoords(cell) {
    return cell.x < size && cell.y < size && cell.x >= 0 && cell.y >= 0;
  }
};
Grid.prototype.print = function () {
  for (let row of this.grid) {
    let string = "";
    for (let cell of row) {
      string += cell + " ";
    }
    console.log(string);
  }
  console.log("");
};
Grid.prototype.addPlayer = function (x, y) {
  let coreCoords = getCoordsAround(x, y, 1);

  let addCoords = getCoordsAround(x, y, 2);

  this.changeCells(coreCoords, SYMBOLS.core);
  this.changeCells(addCoords, SYMBOLS.add);
  this.grid[y][x] = SYMBOLS.player;
};
Grid.prototype.getPlayerCoords = function () {
  let firstCells = this.getBySymbol(SYMBOLS.empty);
  let secondCells = this.getBySymbol(SYMBOLS.add);
  let cellToAdd;

  if (firstCells.length != 0) {
    cellToAdd = getRandomFrom(firstCells);
  } else {
    cellToAdd = getRandomFrom(secondCells);
  }

  return { x: cellToAdd.x, y: cellToAdd.y };

  function getRandomFrom(arr) {
    if (arr.length != 0) {
      return arr[Math.floor(Math.random() * arr.length)];
    } else {
      return false;
    }
  }
};
Grid.prototype.getBySymbol = function (symbol) {
  let coords = [];
  for (let i = 0; i < this.size; i++) {
    for (let j = 0; j < this.size; j++) {
      if (this.cell(j, i) == symbol) {
        coords.push({ x: j, y: i });
      }
    }
  }
  return coords;
};
Grid.prototype.cell = function (x, y) {
  return this.grid[y][x];
};

function getPlayerCoords(size, playersNum) {
  let grid = new Grid(size, SYMBOLS.empty, SYMBOLS.core);
  for (let i = 0; i < playersNum; i++) {
    if (grid.getBySymbol(SYMBOLS.add).length == 0
      && grid.getBySymbol(SYMBOLS.empty).length == 0) {break}
    let cd = grid.getPlayerCoords();
    grid.addPlayer(cd.x, cd.y);
  }
  // grid.print();
  return grid.getBySymbol(SYMBOLS.player);
}
let testData = [];
for (let j = 5; j < 21; j += 2) {
  let oneSizeData = {};
  for (let i = 0; i < 100; i++) {
    let amount = getPlayerCoords(j, 30).length;
    if (oneSizeData[amount] == undefined) {
      oneSizeData[amount] = {amount: 1}
    } else {
      oneSizeData[amount].amount += 1
    }
  }
  testData.push({size: j, data: oneSizeData});
}
let someArray = [];
for (let dataPart of testData) {
  someArray.push([
    dataPart.size,
    Object.keys(dataPart.data)[0]
  ]);
}
console.log(someArray);
// 5 - 2, 7 - 4, 9 - 9,
function getCoordsAround(dotX, dotY, rd) {
  let coordsDot = { x: -rd + dotX, y: rd + dotY };
  let coords = [];
  let COORDS_CHANGE = [
    { cd: "x", num: 1 },
    { cd: "y", num: -1 },
    { cd: "x", num: -1 },
    { cd: "y", num: 1 },
  ];
  let mult = rd * 2;
  for (let change of COORDS_CHANGE) {
    for (let i = 0; i < mult; i++) {
      coordsDot[change.cd] += change.num;
      coords.push({ y: coordsDot.y, x: coordsDot.x });
    }
  }
  return coords;
}
