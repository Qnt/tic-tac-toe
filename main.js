const STATE = {
  cellValues: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  token: 'X',
  winner: null,
  moveNum: 0,
};

const WIN_COMBS = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

const gameField = document.getElementById('game-field');
const btnReset = document.getElementById('new-game-btn');
const gameOver = document.getElementById('game-over');
btnReset.addEventListener('click', startNewGame);

document.body.onload = startNewGame();

function startNewGame() {
  STATE.cellValues = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  STATE.token = 'X';
  STATE.winner = null;
  STATE.moveNum = 0;
  fillGameField();

  hideGameOver();
  gameField.addEventListener('click', handleCellClick);
}

function fillGameField() {
  for (const cell of gameField.children) {
    const [x, y] = cell.id.split('-').map((id) => Number(id));
    cell.innerText = STATE.cellValues[x][y];
  }
}

function hideGameOver() {
  gameOver.style.display = 'none';
}

function showGameOver() {
  let message = `The winner is ${STATE.winner}`;
  if (!STATE.winner) {
    message = "It's a DRAW :(";
  }
  gameOver.innerText = message;
  gameOver.style.display = 'block';
}

function isGameOver() {
  return STATE.winner !== null || STATE.moveNum === 9;
}

function handleCellClick(event) {
  if (event.target.className === 'cell' && event.target.innerText === '') {
    STATE.moveNum += 1;
    event.target.innerText = STATE.token;

    const [x, y] = event.target.id.split('-').map((id) => Number(id));
    STATE.cellValues[x][y] = STATE.token;
    if (STATE.moveNum >= 5) {
      STATE.winner = checkWinner([x, y]);
    }
    if (isGameOver()) {
      showGameOver();
      gameField.removeEventListener('click', handleCellClick);
      return;
    }
    STATE.token = STATE.token === 'X' ? 'O' : 'X';
  }
}

function checkWinner(idxs) {
  for (const comb of WIN_COMBS) {
    const stack = [];
    for (const [x, y] of comb) {
      stack.push(STATE.cellValues[x][y]);
    }
    const uniq = stack.filter((val, index, self) => {
      return self.indexOf(val) === index;
    });
    if (uniq.length === 1 && !uniq.includes(null)) {
      return uniq[0];
    }
  }
  return null;
}
