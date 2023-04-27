var statistics = {
  getPlayersData: function() {}  
};

statistics.getPlayersData = function (grid, players) {
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
      dotsAmount
    });
  }
  return playersData;
}