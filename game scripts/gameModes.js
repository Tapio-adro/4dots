var gameModes = {
    'homeDef': {

    }
}

gameModes.homeDef.removeHomeAreaElement = function (lostTeams) {
    if (gameMode != 'home_def') return;

    for (let team of lostTeams) {
        let homeElem = team.homelandArea;
        homeElem.classList.add('hiden');
        setTimeout(() => {
            homeElem.remove();
        }, 1000)
    }
}
gameModes.homeDef.resizeHomeAreaElements = function () {
    if (gameMode != 'home_def') return;

    for (let team of teams) {
        let div = team.homelandArea;
        let cellRect = team.coreCell.elem.getBoundingClientRect();
        div.style.top = cellRect.top - 55 + 'px';
        div.style.left = cellRect.left - 55 + 'px';
    }

}
gameModes.homeDef.createHomeAreaElements = function () {
    if (gameMode != 'home_def') return;

    for (let team of teams) {
        let div = document.createElement('div');
        div.classList.add('homeland_area');
        div.style.borderColor = team.coreCell.borderColor;
        document.querySelector('#window').appendChild(div);
        team.homelandArea = div;
    }
}
gameModes.homeDef.checkHomelands = function (teams) {
    if (gameMode != 'home_def') return;

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
gameModes.homeDef.hideHomeAreaOnPlayerTurn = function (teams) {
    if (gameMode != 'home_def' || !curTeam.isPlayer) return;

    for (let team of teams) {
        let areaElem = team.homelandArea;
        areaElem.classList.add('on_player_turn');
    }
}
gameModes.homeDef.showHomeAreaOnPlayerTurn = function (teams) {
    if (gameMode != 'home_def' || !curTeam.isPlayer) return;

    for (let team of teams) {
        let areaElem = team.homelandArea;
        areaElem.classList.add('after_player_turn');
        setTimeout(() => {
            areaElem.classList.remove('on_player_turn');
            areaElem.classList.remove('after_player_turn');
        }, 200)
    }
}