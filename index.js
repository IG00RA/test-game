class GameField {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.field = this.generateField();
  }

  generateField() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const icons = ["♡", "♢", "♣", "♠"];

    return Array.from({ length: this.rows }, () =>
      Array.from({ length: this.columns }, () => {
        const randomSuitIndex = Math.floor(Math.random() * suits.length);
        return icons[randomSuitIndex];
      })
    );
  }

  findAndRemoveGroup(row, column, target, visited = new Set()) {
    if (
      this.isValidCell(row, column, visited) &&
      this.field[row][column] === target
    ) {
      visited.add(`${row}-${column}`);
      this.field[row][column] = null;

      this.getNeighbors(row, column).forEach(([r, c]) =>
        this.findAndRemoveGroup(r, c, target, visited)
      );
    }
  }

  isValidCell(row, column, visited) {
    return (
      row >= 0 &&
      row < this.rows &&
      column >= 0 &&
      column < this.columns &&
      !visited.has(`${row}-${column}`)
    );
  }

  getNeighbors(row, column) {
    return [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ].filter(([r, c]) => this.isValidCell(r, c, new Set()));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const game = new GameField(7, 6);
  const table = document.getElementById("gameTable");

  function updateTable() {
    table.innerHTML = "";

    game.field.forEach((rowData, i) => {
      const row = document.createElement("tr");

      rowData.forEach((cellData, j) => {
        const cell = document.createElement("td");
        cell.innerHTML = cellData;

        if (cellData === null) {
          cell.classList.add("removed");
        }

        cell.addEventListener("click", () => handleCellClick(i, j));
        row.appendChild(cell);
      });

      table.appendChild(row);
    });
  }

  function handleCellClick(row, column) {
    const targetElement = game.field[row][column];
    game.findAndRemoveGroup(row, column, targetElement);
    updateTable();
  }

  updateTable();
});
