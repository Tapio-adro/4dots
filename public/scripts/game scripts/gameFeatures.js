var gameFeatures = {
  betterBorders: {},
  scaleGameElements: function() {},
  getPlayerColors: function() {},
  getBotTurn: function() {},
  showWinner: function() {},
  getPlayersData: function() {}
}

gameFeatures.betterBorders.updateBorders = function (grid) {
  for (let cell of grid.array.filter((cell2) => cell2.shouldUpdateBorder)) {
    gameFeatures.betterBorders.setCellBorder(cell);
    cell.shouldUpdateBorder = false;
  }
};
gameFeatures.betterBorders.setCellBorder = function (cell) {
  if (cell.color == cell.cells.BLACK || cell.isNeutral) return;

  let x = cell.x;
  let y = cell.y;
  let grid = cell.cells;
  let style = cell.elem.style;

  style.borderTopColor =
    grid.cell(x - 1, y) && grid.cell(x - 1, y).color == cell.color
      ? "rgba(0, 0, 0, 0)"
      : cell.borderColor;
  style.borderBottomColor =
    grid.cell(x + 1, y) && grid.cell(x + 1, y).color == cell.color
      ? "rgba(0, 0, 0, 0)"
      : cell.borderColor;
  style.borderRightColor =
    grid.cell(x, y + 1) && grid.cell(x, y + 1).color == cell.color
      ? "rgba(0, 0, 0, 0)"
      : cell.borderColor;
  style.borderLeftColor =
    grid.cell(x, y - 1) && grid.cell(x, y - 1).color == cell.color
      ? "rgba(0, 0, 0, 0)"
      : cell.borderColor;
};
gameFeatures.betterBorders.highlightPlayerBorder = function (grid, player, color) {
  for (let cell of grid.getByPlayer(player)) {
    let x = cell.x;
    let y = cell.y;
    let style = cell.elem.style;

    style.borderTopColor =
      grid.cell(x - 1, y) && grid.cell(x - 1, y).color == cell.color
        ? "rgba(0, 0, 0, 0)"
        : color;
    style.borderBottomColor =
      grid.cell(x + 1, y) && grid.cell(x + 1, y).color == cell.color
        ? "rgba(0, 0, 0, 0)"
        : color;
    style.borderRightColor =
      grid.cell(x, y + 1) && grid.cell(x, y + 1).color == cell.color
        ? "rgba(0, 0, 0, 0)"
        : color;
    style.borderLeftColor =
      grid.cell(x, y - 1) && grid.cell(x, y - 1).color == cell.color
        ? "rgba(0, 0, 0, 0)"
        : color;
  }
};
gameFeatures.betterBorders.setStyles = function () {
  document.querySelector("#table").classList.add("better_borders");
};

gameFeatures.scaleGameElements = function () {
  let root = document.querySelector(':root');

  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;

  let width, height;

  let zoomLevel;

  width = gameFieldWidth;
  height = gameFieldHeight;

  var padding = window.innerHeight > 600 ? 40 : 0

  if (windowWidth > windowHeight) {
    zoomLevel = (windowHeight - padding) / height;
    // wrapper.style.height = 'calc(100vh / var(--zoomLevel))';
  } else {
    zoomLevel = windowWidth / width;
    // wrapper.style.height = 'calc(100vh / var(--zoomLevel))';
  }

  root.style.setProperty('--zoomLevel', zoomLevel);
}

gameFeatures.getPlayerColors = function (amount) {
  let colorFraction = 345 / amount;
  let huesArray = [];
  for (let i = 0; i < amount; i++) {
    huesArray.push(Math.floor(colorFraction * i));
  }
  let rgbArray = [];
  let rgbInvertedArray = [];
  let s = 100, l = 70;
  for (let hueColor of huesArray) {
    let rgbColor = HSLToRGB(hueColor, s, l);
    rgbColor = rgbColor.map(num => Math.floor(num)).join(', ');
    rgbArray.push(rgbColor)

    let hslInverted = invertHSL(hueColor, 70, 70);
    let rgbInvertedColor = HSLToRGB(...hslInverted);
    rgbInvertedColor = rgbInvertedColor.map(num => Math.floor(num)).join(', ');
    rgbInvertedArray.push(rgbInvertedColor)
  }
  let colorsArray = [];
  for (let key in rgbArray) {
    let color = rgbArray[key];
    colorsArray.push([color, rgbInvertedArray[key]]);
  }
  return colorsArray;

  function HSLToRGB(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };
  function invertHSL (h, s, l) {
    return [(h + 180) % 360, s, l - 20];
  }
}

gameFeatures.getBotTurn = function (grid, botColor, behaviorTypes) {

  for (let behavior of behaviorTypes) {
    let cell = getBehaviorResult(behavior);
    if (cell) {
      return cell;
    }
  }

  function getBehaviorResult (behavior) {
    let botCells = grid.getByColor(botColor);
  
    switch (behavior) {
      case "3_by_3":
        botCells = botCells.filterByDots(3);
  
        for (let botCell of botCells) {
          if (botCell.hasRivalNeighbourWithDots(3)) {
            return botCell;
          }
        }
        break;
      case "bigger_by_smaller":
        // for cells with 3 dots
        let botCells_3 = botCells.filterByDots(3);
        if (botCells_3.length) {
          // first try if it has rival neighbour with 2 dots
          for (let botCell of botCells_3) {
            let hasNear_2 = botCell.hasRivalNeighbourWithDots(2);
            if (hasNear_2) {
              return botCell;
            }
          }
          // then try if it has rival neighbour with 1 dot
          for (let botCell of botCells_3) {
            let hasNear_1 = botCell.hasRivalNeighbourWithDots(1);
            if (hasNear_1) {
              return botCell;
            }
          }
        }
        // for cells with 2 dots
        let botCells_2 = botCells.filterByDots(2);
        if (botCells_2.length) {
          // first try 2_by_2_byn_3
          for (let botCell of botCells_2) {
            let hasNear_2 = botCell.hasRivalNeighbourWithDots(2);
            let hasNotNear_3 = botCell.hasNotRivalNeighbourWithDots(3);
            if (hasNear_2 && hasNotNear_3) {
              return botCell;
            }
          }
          // then try 2_by_1_byn_3
          for (let botCell of botCells_2) {
            let hasNear_1 = botCell.hasRivalNeighbourWithDots(1);
            let hasNotNear_3 = botCell.hasNotRivalNeighbourWithDots(3);
            if (hasNear_1 && hasNotNear_3) {
              return botCell;
            }
          }
        }
        let botCells_1 = botCells.filterByDots(1);
        if (botCells_1.length) {
          // try 1_by_1_byn_2_byn_3
          for (let botCell of botCells_1) {
            let hasNear_1 = botCell.hasRivalNeighbourWithDots(1);
            let hasNotNear_2 = botCell.hasNotRivalNeighbourWithDots(2);
            let hasNotNear_3 = botCell.hasNotRivalNeighbourWithDots(3);
            if (hasNear_1 && hasNotNear_2 && hasNotNear_3) {
              return botCell;
            }
          }
        }
        break;
      case "get_closer_to_enemy":
        for (let botCell of botCells) {
          if (botCell.hasRivalNeighbour()) {
            return;
          }
        }

        let rivalCells = getRivalCells();
        return findClosestCell(botCells, rivalCells);
      case "dot_inside":
        botCells = botCells.filter(
          (cell) => cell.dots != 2 || cell.hasNotRivalNeighbourWithDots(3)
        );

        if (!botCells.length) return;

        let safeCellsInside = []
        for (let botCell of botCells) {
          if (botCell.dots <= 2) {
            safeCellsInside.push(botCell);
          } else if (botCell.cellsAround().filter((cell) => cell.hasRivalNeighbour()) == 0) {
            console.log('here');
            safeCellsInside.push(botCell);
          }
        }

        if (safeCellsInside.length) {
          return safeCellsInside.randomElement();
        } else {
          return botCells.randomElement();
        }
        break;
      case "less_than_2":
        botCells = botCells.filterByDots(2, '<=');

        if (!botCells.length) return;

        let botCellsWithTwoDots = botCells.filterByDots(2);
        if (botCellsWithTwoDots.length) {
          return botCellsWithTwoDots.randomElement();
        }

        return botCells.randomElement();
      case "any_by_free":
        botCells = excludeAtEdge(botCells);
        
        if (!botCells.length) return;
  
        let freeCellsAround = findFreeCellsAround(botCells);
        
        let botCellsWith_2_FreeNeighbours = [];
        let botCellsWith_3_or_4_FreeNeighbours = [];

        for (let key in freeCellsAround) {
          let cur = freeCellsAround[key];
          if (cur == 2) {
            botCellsWith_2_FreeNeighbours.push(botCells[key]);
          }
          if (cur >= 3) {
            botCellsWith_3_or_4_FreeNeighbours.push(botCells[key]);
          }
        }

        if (botCellsWith_3_or_4_FreeNeighbours) {
          return botCellsWith_3_or_4_FreeNeighbours.randomElement();
        }
        if (botCellsWith_2_FreeNeighbours) {
          return botCellsWith_2_FreeNeighbours.randomElement();
        }
        break;
      case "any_byn_edge":
        botCells = excludeAtEdge(botCells);

        if (!botCells.length) return;

        return botCells.randomElement();
      case "any":
        return botCells.randomElement();
    }
    return false;
  }

  function findClosestCell(firstCellsArray, secondCellsArray) {
    let closestDistance = Infinity;
    let closestPoint = null;
  
    for (let i = 0; i < firstCellsArray.length; i++) {
      for (let j = 0; j < secondCellsArray.length; j++) {
        let dx = firstCellsArray[i].x - secondCellsArray[j].x;
        let dy = firstCellsArray[i].y - secondCellsArray[j].y;
        let distanceSquared = dx ** 2 + dy ** 2;
        if (distanceSquared < closestDistance) {
          closestDistance = distanceSquared;
          closestPoint = firstCellsArray[i];
        }
      }
    }

    return closestPoint;
  }
  function findFreeCellsAround(botCells) {
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
  function getRivalCells () {
    let result = [];
    for (let cell of grid.array) {
      if (cell.color != grid.BLACK && cell.color != botColor) {
        result.push(cell);
      }
    }
    return result;
  }
  function excludeAtEdge(cells) {
    let edge = grid.size - 1;
    return cells.filter(
      (cell) => cell.x != 0 && cell.y != 0 && cell.x != edge && cell.y != edge
    );
  }
};

gameFeatures.showWinner = function (player, lang) {
  let subject = lang == 'uk' ? 
    (player.isPlayer ? 'Гравець' : 'Бот')
    : (player.isPlayer ? 'Player' : 'Bot')
  let winWord = lang == 'uk' ? 'виграв' : 'won'
  let string =  subject + ' ' + winWord + '!';
  var elem = document.querySelector('#win_overlay')
  elem.style.color = player.colorRGB
  elem.innerHTML = string
  elem.classList.remove('hidden');
}

gameFeatures.getPlayersData = function (grid, players) {
  let playersData = [];
  console.log(players.length);
  for (let player of players) {
    let cells = grid.getByPlayer(player);

    let dotsAmount = 0;

    for (let cell of cells) {
      dotsAmount += cell.dots;
    }
    
    playersData.push({
      color: player.colorRGB,
      cellsAmount: cells.length,
      dotsAmount
    });
  }
  return playersData;
}

// template
// gameFeatures. = function () {
  
// }