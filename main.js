const STATE = {};

const WIN_COMBS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameField = document.getElementsByClassName('game-field')[0];
const tokenSelect = document.getElementsByClassName('token-select')[0];
const newGameBtn = document.getElementById('new-game');

newGameBtn.addEventListener('click', startNewGame);
tokenSelect.addEventListener('click', handleTokenSelect);

document.body.onload = startNewGame();

function startNewGame() {
  gameField.addEventListener('click', handleCellClick);
  initState();
  showElement(tokenSelect);
  initGameField();
}

function initState() {
  STATE.cellValues = new Array(9).fill(null);
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

function handleTokenSelect(event) {
  if (event.target.nodeName === 'BUTTON') {
    STATE.token = event.target.id;

    hideElement(tokenSelect);
  }
}

function initGameField() {
  for (const cell of gameField.children) {
    cell.classList.remove('win-mark');
    const id = +cell.id;
    cell.textContent = STATE.cellValues[id];
  }
}

function isGameOver() {
  return STATE.winner !== null || STATE.moveNum === 9;
}

function handleCellClick(event) {
  if (event.target.nodeName === 'DIV' && event.target.textContent === '') {
    let winComb;
    const id = +event.target.id;

    STATE.moveNum += 1;
    event.target.textContent = STATE.token;
    STATE.cellValues[id] = STATE.token;

    if (STATE.moveNum >= 5) {
      [STATE.winner, winComb] = checkWinner();
    }

    if (isGameOver()) {
      if (winComb) {
        markComb(winComb);
      }
      gameField.removeEventListener('click', handleCellClick);
    }
    STATE.token = STATE.token === 'X' ? '0' : 'X';
  }
}

function checkWinner() {
  for (const comb of WIN_COMBS) {
    const stack = [];
    for (const id of comb) {
      stack.push(STATE.cellValues[id]);
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
  for (const id of comb) {
    const winCell = document.getElementById(`${id}`);
    winCell.classList.add('win-mark');
  }
}
