var gameFeatures = {
  scaleGameElements: function() {},
  getTeamColors: function() {},
  getBotTurn: function() {}
}

gameFeatures.scaleGameElements = function () {
  let root = document.querySelector(':root');

  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;

  let width, height;

  let zoomLevel;

  width = gameFieldWidth;
  height = gameFieldHeight;

  if (windowWidth > windowHeight) {
    zoomLevel = windowHeight / height;
    // wrapper.style.height = 'calc(100vh / var(--zoomLevel))';
  } else {
    zoomLevel = windowWidth / width;
    // wrapper.style.height = 'calc(100vh / var(--zoomLevel))';
  }

  root.style.setProperty('--zoomLevel', zoomLevel);
}
gameFeatures.getTeamColors = function (amount) {
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
      if (h < 180) {
          h += 180;
      } else {
          h -= 180;
      }
      return [h, s, l];
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
    let rivalCells = getRivalCells();
  
    switch (behavior) {
      case "3_by_3":
        botCells = botCells.filterByDots(3);
        rivalCells = rivalCells.filterByDots(3);
  
        for (let botCell of botCells) {
          let cellsAround = botCell.cellsAround();
          for (let cell of cellsAround) {
            if (rivalCells.includes(cell)) {
              return botCell;
            }
          }
        }
        break;
      case "bigger_by_smaller":
        // for cells with 3 dots
        let botCells_3 = botCells.filterByDots(3);
        if (botCells_3.length) {
          // first try if it has rival neighbour with 2 dots
          for (let botCell of botCells) {
            let hasNear_2 = botCell.hasNeighbourWithDots(2);
            if (hasNear_2) {
              return botCell;
            }
          }
          // then try if it has rival neighbour with 1 dot
          for (let botCell of botCells) {
            let hasNear_1 = botCell.hasNeighbourWithDots(1);
            if (hasNear_1) {
              return botCell;
            }
          }
        }
        // for cells with 2 dots
        let botCells_2 = botCells.filterByDots(2);
        if (botCells_2.length) {
          // first try 2_by_2_byn_3
          for (let botCell of botCells) {
            let hasNear_2 = botCell.hasNeighbourWithDots(2);
            let hasNotNear_3 = botCell.hasNotNeighbourWithDots(3);
            if (hasNear_2 && hasNotNear_3) {
              return botCell;
            }
          }
          // then try 2_by_1_byn_3
          for (let botCell of botCells) {
            let hasNear_1 = botCell.hasNeighbourWithDots(1);
            let hasNotNear_3 = botCell.hasNeighbourWithDots(3);
            if (hasNear_1 && hasNotNear_3) {
              return botCell;
            }
          }
        }
        break;
      case "less_than_2":
        botCells = botCells.filterByDots(2, '<=');
        if (botCells.length) {
          let botCellsWithOneDot = botCells.filterByDots(1);
          if (botCellsWithOneDot.length) {
            return botCellsWithOneDot.randomElement();
          }
        }
        return botCells.randomElement();
      case "any_by_free":
        botCells = excludeAtEdge(botCells);
        
        if (!botCells.length) return false;
  
        let freeCellsAround = findFreeCellsAround(botCells);
  
        let chosenBotCells = [];

        for (let key in freeCellsAround) {
          let cur = freeCellsAround[key];
          if (cur >= 2) {
            chosenBotCells.push(botCells[key]);
          }
        }
  
        return chosenBotCells.randomElement();
      case "any_byn_edge":
        botCells = excludeAtEdge(botCells);
        return botCells.randomElement();
      case "any":
        return botCells.randomElement();
    }
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
