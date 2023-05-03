var statistics = {
  passInitialPlayersData: function() {},
  passPlayersData: function() {},
  getPlayersData: function() {}
};

statistics.passInitialPlayersData = function (data) {
  if (!appData.globalSettings.gatherPlayersData) return;

  const event = new CustomEvent("passInitialPlayersData", { detail: data });
  dispatchEvent(event);
};
statistics.passPlayersData = function (data) {
  if (!appData.globalSettings.gatherPlayersData) return;

  const event = new CustomEvent("passPlayersData", { detail: data });
  dispatchEvent(event);
};
statistics.getPlayersData = function (grid, players) {
  if (!appData.globalSettings.gatherPlayersData) return;

  let playersData = [];
  for (let player of players) {
    let cells = grid.getByPlayer(player);

    let dotsAmount = 0;

    for (let cell of cells) {
      dotsAmount += cell.dots;
    }
    
    playersData.push({
      color: player.colorRGB,
      cellsAmount: cells.length,
      dotsAmount,
      isHuman: player.isHuman
    });
  }

  return playersData;
};