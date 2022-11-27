var gameOptions = {
    betterBorders: {},
    maxOptimization: {},
    boomCircles: {},
    gameSpeed: {}
}

gameOptions.gameSpeed.setGameSpeed = function() {
    let speeds = {
        0: [500, 200],
        1: [100, 0],
        2: [10, 0]
    }
    gameOptions.gameSpeed.activateFoursSpeed = speeds[gameOptionsValues.gameSpeed][0];
    gameOptions.gameSpeed.teamChangeSpeed = speeds[gameOptionsValues.gameSpeed][1];
}

gameOptions.boomCircles.spawnBoomCircle = function(cell) {
    if (!gameOptionsValues.boomCircles || gameOptionsValues.maxOptimization) return;
    
    let elemRect = cell.elem.getBoundingClientRect(),
    y = elemRect.y,
    x = elemRect.x;
    console.log(cell);
    let color = 'rgb(' + cell.color + ')';

    let circle = document.createElement('div');
    circle.classList.add('boom_circle');

    circle.style.top = y + 'px';
    circle.style.left = x + 'px';
    circle.style.backgroundColor = color;

    container.appendChild(circle);

    setTimeout(() => {
        circle.classList.add('scale_circle');
    }, 10)

    setTimeout(() => {
        circle.remove();
    }, 3000)
}

gameOptions.maxOptimization.setMaxOptimization = function() {
    if (!gameOptionsValues.maxOptimization) return;

    let root = document.querySelector(':root');

    root.style.setProperty('--cellTransition', 'none');
}

gameOptions.betterBorders.setCellBorder = function(cell) {
    if (!gameOptionsValues.betterBorders || cell.isNeutral) return;
    if (cell.color == cell.cells.BLACK) return;

    let x = cell.x;
    let y = cell.y;
    let grid = cell.cells;
    let style = cell.elem.style;

    style.borderTopColor = grid.cell(x - 1, y) && grid.cell(x - 1, y).color == cell.color ? 'rgba(0, 0, 0, 0)' : cell.borderColor;
    style.borderBottomColor = grid.cell(x + 1, y) && grid.cell(x + 1, y).color == cell.color ? 'rgba(0, 0, 0, 0)' : cell.borderColor;
    style.borderRightColor = grid.cell(x, y + 1) && grid.cell(x, y + 1).color == cell.color ? 'rgba(0, 0, 0, 0)' : cell.borderColor;
    style.borderLeftColor = grid.cell(x, y - 1) && grid.cell(x, y - 1).color == cell.color ? 'rgba(0, 0, 0, 0)' : cell.borderColor;
}
gameOptions.betterBorders.highlightTeamBorder = function(grid, team, color) {
    if (!gameOptionsValues.betterBorders) return;

    for (let cell of grid.getByTeam(team)) {
        let x = cell.x;
        let y = cell.y;
        let style = cell.elem.style;

        style.borderTopColor = grid.cell(x - 1, y) && grid.cell(x - 1, y).color == cell.color ? 'rgba(0, 0, 0, 0)' : color;
        style.borderBottomColor = grid.cell(x + 1, y) && grid.cell(x + 1, y).color == cell.color ? 'rgba(0, 0, 0, 0)' : color;
        style.borderRightColor = grid.cell(x, y + 1) && grid.cell(x, y + 1).color == cell.color ? 'rgba(0, 0, 0, 0)' : color;
        style.borderLeftColor = grid.cell(x, y - 1) && grid.cell(x, y - 1).color == cell.color ? 'rgba(0, 0, 0, 0)' : color;
    }
}
gameOptions.betterBorders.setStyles = function() {
    if (!gameOptionsValues.betterBorders) return;

    document.querySelector('#table').classList.add('better_borders');
}
gameOptions.betterBorders.updateBorders = function(grid) {
    if (!gameOptionsValues.betterBorders) return;

    for (let cell of grid.array.filter(cell2 => cell2.shouldUpdateBorder)) {
        gameOptions.betterBorders.setCellBorder(cell);
        cell.shouldUpdateBorder = false;
    }
}


