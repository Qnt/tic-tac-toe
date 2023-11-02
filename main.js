const STATE = {
  cellValues: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  token: null,
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

const gameField = document.getElementsByClassName('game-field')[0];
const tokenSelect = document.getElementsByClassName('token-select')[0];
const newGameBtn = document.getElementById('new-game');

newGameBtn.addEventListener('click', startNewGame);
tokenSelect.addEventListener('click', selectToken);

document.body.onload = startNewGame();

function startNewGame() {
  gameField.addEventListener('click', handleCellClick);
  initState();
  showElement(tokenSelect);
  initGameField();
}

function initState() {
  STATE.cellValues = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  STATE.token = null;
  STATE.winner = null;
  STATE.moveNum = 0;
}

function showElement(element) {
  element.classList.remove('hide');
}

function hideElement(element) {
  element.classList.add('hide');
}

function selectToken(event) {
  if (event.target.nodeName === 'BUTTON') {
    STATE.token = event.target.id;

    hideElement(tokenSelect);
  }

  if (STATE.token === '0') {
    STATE.token = STATE.token === 'X' ? '0' : 'X';
    makeBotMove();
  }
}

function initGameField() {
  for (const cell of gameField.children) {
    cell.classList.remove('win-mark');
    const [x, y] = cell.id.split('-').map((id) => Number(id));
    cell.textContent = STATE.cellValues[x][y];
  }
}

function isGameOver() {
  return STATE.winner !== null || STATE.moveNum === 9;
}

function handleCellClick(event) {
  if (event.target.nodeName === 'DIV' && event.target.textContent === '') {
    let winComb;
    const [x, y] = event.target.id.split('-').map((id) => Number(id));

    STATE.moveNum += 1;
    event.target.textContent = STATE.token;
    STATE.cellValues[x][y] = STATE.token;

    if (STATE.moveNum >= 5) {
      [STATE.winner, winComb] = checkWinner();
    }

    if (isGameOver()) {
      if (winComb) {
        markComb(winComb);
      }
      gameField.removeEventListener('click', handleCellClick);
      return;
    }
    STATE.token = STATE.token === 'X' ? '0' : 'X';

    makeBotMove();
  }
}

function makeBotMove() {
  let winComb;

  STATE.moveNum += 1;

  let [x, y] = generateRandomCoordinates();

  while (STATE.cellValues[x][y]) {
    [x, y] = generateRandomCoordinates();
  }

  STATE.cellValues[x][y] = STATE.token;
  for (const cell of gameField.children) {
    if (cell.id === `${x}-${y}`) {
      cell.textContent = STATE.token;
    }
  }

  if (STATE.moveNum >= 5) {
    [STATE.winner, winComb] = checkWinner();
  }

  if (isGameOver()) {
    if (winComb) {
      markComb(winComb);
    }
    gameField.removeEventListener('click', handleCellClick);
    return;
  }
  STATE.token = STATE.token === 'X' ? '0' : 'X';
}

function generateRandomCoordinates() {
  let x = Math.floor(Math.random() * STATE.cellValues.length);
  let y = Math.floor(Math.random() * STATE.cellValues.length);
  return [x, y];
}

function checkWinner() {
  for (const comb of WIN_COMBS) {
    const stack = [];
    for (const [x, y] of comb) {
      stack.push(STATE.cellValues[x][y]);
    }
    const uniq = stack.filter(
      (val, index, self) => self.indexOf(val) === index,
    );
    if (uniq.length === 1 && !uniq.includes(null)) {
      return [uniq[0], comb];
    }
  }
  return [null, null];
}

function markComb(comb) {
  for (const coordinates of comb) {
    const winCell = document.getElementById(coordinates.join('-'));
    winCell.classList.add('win-mark');
  }
}
