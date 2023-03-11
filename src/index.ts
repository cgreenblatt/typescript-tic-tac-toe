import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT = 3;
const COL_COUNT = 3;
type Move = "X" | "O"
type Cell = Move | "";
type Row = [Cell, Cell, Cell];
type Board = [Row, Row, Row];
type Winner = Move | "Draw" | undefined;

let boardState: Board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
let currentMove: Move = "X";
let winner: Winner;

function createCell(row: number, col: number, content: Cell = "") {
  const cell = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");
  cell.addEventListener('click', () => {
    if (winner) return;
    if (!boardState[row][col]) {
      boardState[row][col] = currentMove;
      currentMove = currentMove === "X" ? "O" : "X";
      winner = getWinner();
      renderBoard();
    }
  })
  return cell;
}

function renderBoard() {
  if (!appElement) throw new Error("Cannot find app");
  if (!boardElement) throw new Error("Cannot find board");
  boardElement.innerHTML = "";
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));
    }
  }
  const oldMoveElement = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = winner
    ? `Winner ${winner}`
    : `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function getWinner(): Winner {
  // check rows
  for (let row = 0; row < ROW_COUNT; row += 1 ) {
    const cell: Cell = boardState[row][0];
    if (cell === "") continue;
    for (let col = 1; col < COL_COUNT && boardState[row][col] === cell; col += 1) {
      if (col === COL_COUNT - 1) {
        return cell;
      }
    }
  }
  // check columns
  for (let col = 0; col < COL_COUNT; col += 1) {
    const cell: Cell = boardState[0][col];
    if (cell === "") continue;
    for (let row = 1; row < ROW_COUNT && boardState[row][col] === cell; row += 1) {
      if (row === ROW_COUNT - 1) {
        return cell;
      }
    }
  }
  // check diagonal left to right
  let cell: Cell = boardState[0][0];
  if (cell) {
    for (let i = 1; i < ROW_COUNT && boardState[i][i] === cell; i += 1) {
      if (i === ROW_COUNT -1) {
        return cell;
      }
    }  
  }
  // check diagonal right to left
  cell = boardState[0][2];
  if (cell) {
    for (let row = 1, col = 1; row < ROW_COUNT && boardState[row][col] === cell; row += 1, col -= 1) {
      if (row === ROW_COUNT -1) {
        return cell;
      }
    }
  }

  let isDraw = true;
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let col = 0; col < COL_COUNT; col++) {
      if (boardState[row][col] === "") isDraw = false;
    }
  }
  if (isDraw) return "Draw"
  
  return undefined;
}

function init() {
  const resetButton = document.getElementById("reset");
  if (!resetButton) throw new Error("No Reset button");
  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    currentMove = "X";
    winner = undefined;
    renderBoard();
  });
  renderBoard();
}

init();
