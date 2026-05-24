const ANSWER = 'BRICK';
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

let currentRow = 0;
let currentGuess = [];
let gameOver = false;

const board = document.getElementById('board');
for (let r = 0; r < MAX_GUESSES; r++) {
  const row = document.createElement('div');
  row.classList.add('wordle-row');
  for (let c = 0; c < WORD_LENGTH; c++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.id = `tile-${r}-${c}`;
    row.appendChild(tile);
  }
  board.appendChild(row);
}

const KEYS = [
  ['Q','W','F','P','G','J','L','U','Y'],
  ['A','R','S','T','D','H','N','E','I','O'],
  ['ENTER','Z','X','C','V','B','K','M','⌫']
];

const keyboard = document.getElementById('keyboard');
KEYS.forEach(row => {
  const rowEl = document.createElement('div');
  rowEl.classList.add('key-row');
  row.forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = key;
    btn.classList.add('key');
    if (key === 'ENTER' || key === '⌫') btn.classList.add('key-wide');
    btn.id = `key-${key}`;
    btn.addEventListener('click', () => handleKey(key));
    rowEl.appendChild(btn);
  });
  keyboard.appendChild(rowEl);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleKey('ENTER');
  else if (e.key === 'Backspace') handleKey('⌫');
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

function handleKey(key) {
  if (gameOver) return;
  if (key === '⌫') {
    if (currentGuess.length > 0) {
      currentGuess.pop();
      const col = currentGuess.length;
      const tile = document.getElementById(`tile-${currentRow}-${col}`);
      tile.textContent = '';
      tile.classList.remove('filled');
    }
  } else if (key === 'ENTER') {
    if (currentGuess.length < WORD_LENGTH) { showMessage('Not enough letters'); return; }
    submitGuess();
  } else {
    if (currentGuess.length < WORD_LENGTH) {
      const tile = document.getElementById(`tile-${currentRow}-${currentGuess.length}`);
      tile.textContent = key;
      tile.classList.add('filled');
      currentGuess.push(key);
    }
  }
}

function submitGuess() {
  const isCorrect = currentGuess.join('') === ANSWER;
  const colors = getColors(currentGuess);

  colors.forEach((color, i) => {
    setTimeout(() => {
      document.getElementById(`tile-${currentRow}-${i}`).classList.add('flip', color);
      const key = document.getElementById(`key-${currentGuess[i]}`);
      if (key) {
        if (color === 'green') key.classList.add('green');
        else if (color === 'yellow' && !key.classList.contains('green')) key.classList.add('yellow');
        else if (color === 'gray' && !key.classList.contains('green') && !key.classList.contains('yellow')) key.classList.add('gray');
      }
    }, i * 300);
  });

  setTimeout(() => {
    if (isCorrect) {
      gameOver = true;
      showModal();
    } else {
      currentRow++;
      currentGuess = [];
      if (currentRow >= MAX_GUESSES) {
        gameOver = true;
        showMessage('Better luck next time!');
      }
    }
  }, WORD_LENGTH * 300 + 400);
}

function getColors(guess) {
  const answer = ANSWER.split('');
  const result = Array(WORD_LENGTH).fill('gray');
  guess.forEach((l, i) => {
    if (l === answer[i]) { result[i] = 'green'; answer[i] = null; }
  });
  guess.forEach((l, i) => {
    if (result[i] === 'green') return;
    const j = answer.indexOf(l);
    if (j !== -1) { result[i] = 'yellow'; answer[j] = null; }
  });
  return result;
}

function showMessage(msg) {
  const el = document.getElementById('message');
  el.textContent = msg;
  if (msg) setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2000);
}

function showModal() {
  document.getElementById('modal-overlay').classList.add('active');
}