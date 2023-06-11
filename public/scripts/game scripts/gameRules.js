var gameRules = {
    'homeDef': {}
}

gameRules.homeDef.createHomeAreaElements = function () {
    if (!gameRulesValues.homeDef) return;

    for (let player of players) {
        let div = document.createElement('div');
        div.classList.add('homeland_area');
        div.style.borderColor = player.coreCell.borderColor;
        document.querySelector('#window').appendChild(div);
        player.homelandArea = div;
    }
}
gameRules.homeDef.resizeHomeAreaElements = function () {
    if (!gameRulesValues.homeDef) return;

    for (let player of players) {
        let div = player.homelandArea;
        let cellRect = player.coreCell.elem.getBoundingClientRect();
        div.style.top = cellRect.top - 55 + 'px';
        div.style.left = cellRect.left - 55 + 'px';
    }
}
gameRules.homeDef.removeHomeAreaElement = function (lostPlayers) {
    if (!gameRulesValues.homeDef) return;

    for (let player of lostPlayers) {
        let homeElem = player.homelandArea;
        homeElem.classList.add('hidden');
        setTimeout(() => {
            homeElem.remove();
        }, 1000)
    }
}
gameRules.homeDef.checkHomelands = function (players) {
    if (!gameRulesValues.homeDef) return;

    for (let player of players) {
        let coreCell = player.coreCell;
        let homeCells = cellsGrid.getByColor(player.color,
            coreCell.cellsAround(cellsGrid.AROUND_SQUARE_RADIUS_1));
        if (homeCells.length == 0) {
            let playerCells = cellsGrid.getByColor(player.color);
            for (let cell of playerCells) {
                cell.reset(true);
            }
        } 
    }
}
gameRules.homeDef.checkHomelands = function (players) {
    if (!gameRulesValues.homeDef) return;

    for (let player of players) {
        let coreCell = player.coreCell;
        let homeCells = cellsGrid.getByColor(player.color,
            coreCell.cellsAround(cellsGrid.AROUND_SQUARE_RADIUS_1));
        if (homeCells.length == 0) {
            let playerCells = cellsGrid.getByColor(player.color);
            for (let cell of playerCells) {
                cell.reset(true);
            }
        } 
    }
}
gameRules.homeDef.hideHomeAreaOnPlayerTurn = function (players) {
    if (!gameRulesValues.homeDef || !curPlayer.isHuman) return;

    for (let player of players) {
        let areaElem = player.homelandArea;
        areaElem.classList.add('on_player_turn');
    }
}
gameRules.homeDef.showHomeAreaAfterPlayerTurn = function (players) {
    if (!gameRulesValues.homeDef || !curPlayer.isHuman) return;

    for (let player of players) {
        let areaElem = player.homelandArea;
        areaElem.classList.add('after_player_turn');
        setTimeout(() => {
            areaElem.classList.remove('on_player_turn');
            areaElem.classList.remove('after_player_turn');
        }, 200)
    }
}