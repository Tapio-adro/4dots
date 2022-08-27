var gameOptions = {
    betterBorders: {},
    maxOptimization: {}
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


