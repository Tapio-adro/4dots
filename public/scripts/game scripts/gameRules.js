var gameRules = {
    'homeDef': {}
}

gameRules.homeDef.createHomeAreaElements = function () {
    if (!gameRulesValues.homeDef) return;

    for (let team of teams) {
        let div = document.createElement('div');
        div.classList.add('homeland_area');
        div.style.borderColor = team.coreCell.borderColor;
        document.querySelector('#window').appendChild(div);
        team.homelandArea = div;
    }
}
gameRules.homeDef.resizeHomeAreaElements = function () {
    if (!gameRulesValues.homeDef) return;

    for (let team of teams) {
        let div = team.homelandArea;
        let cellRect = team.coreCell.elem.getBoundingClientRect();
        div.style.top = cellRect.top - 55 + 'px';
        div.style.left = cellRect.left - 55 + 'px';
    }
}
gameRules.homeDef.removeHomeAreaElement = function (lostTeams) {
    if (!gameRulesValues.homeDef) return;

    for (let team of lostTeams) {
        let homeElem = team.homelandArea;
        homeElem.classList.add('hiden');
        setTimeout(() => {
            homeElem.remove();
        }, 1000)
    }
}
gameRules.homeDef.checkHomelands = function (teams) {
    if (!gameRulesValues.homeDef) return;

    for (let team of teams) {
        let coreCell = team.coreCell;
        let homeCells = cellsGrid.getByColor(team.color, 
            coreCell.cellsAround(cellsGrid.AROUND_SQUARE_NINE));
        if (homeCells.length == 0) {
            let teamCells = cellsGrid.getByColor(team.color);
            for (let cell of teamCells) {
                cell.reset(true);
            }
        } 
    }
}
gameRules.homeDef.hideHomeAreaOnPlayerTurn = function (teams) {
    if (!gameRulesValues.homeDef || !curTeam.isPlayer) return;

    for (let team of teams) {
        let areaElem = team.homelandArea;
        areaElem.classList.add('on_player_turn');
    }
}
gameRules.homeDef.showHomeAreaAfterPlayerTurn = function (teams) {
    if (!gameRulesValues.homeDef || !curTeam.isPlayer) return;

    for (let team of teams) {
        let areaElem = team.homelandArea;
        areaElem.classList.add('after_player_turn');
        setTimeout(() => {
            areaElem.classList.remove('on_player_turn');
            areaElem.classList.remove('after_player_turn');
        }, 200)
    }
}