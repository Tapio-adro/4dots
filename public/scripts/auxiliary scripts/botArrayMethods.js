prototypeFunction(Array, "filterByDots", function (dots, operator = '') {
  if (operator == '') {
    return this.filter((cell) => cell.dots == dots)
  }
  switch (operator) {
    case '>':
      return this.filter((cell) => cell.dots > dots)
    case '<':
      return this.filter((cell) => cell.dots < dots)
    case '>=':
      return this.filter((cell) => cell.dots >= dots)
    case '<=':
      return this.filter((cell) => cell.dots <= dots)
  }
});
prototypeFunction(Array, "getOutline", function () {
  let result = [];
  for (let cell of this) {
    result.push(...cell.getCellsAround())
  }
  return result.filter((value, index, self) =>
    index === self.findIndex((cell) => (
      cell.x === value.x && cell.y === value.y
    ))
  )
});

