const ANSWER_HASH = 'd85177ba7f6717d561d5655579884b60a87da98ce0a170d06804d27d9a554d1a';
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

let currentRow = 0;
let currentCol = 0;
let currentGuess = [];
let gameOver = false;

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function getRuntimeAnswer() {
  return [66,82,73,67,75].map(c => String.fromCharCode(c));
}

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
  ['A','R','S','T','D','H','N','E','I', 'O'],
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
    if (currentCol > 0) {
      currentCol--;
      currentGuess.pop();
      document.getElementById(`tile-${currentRow}-${currentCol}`).textContent = '';
      document.getElementById(`tile-${currentRow}-${currentCol}`).classList.remove('filled');
    }
  } else if (key === 'ENTER') {
    if (currentCol < WORD_LENGTH) { showMessage('Not enough letters'); return; }
    submitGuess();
  } else {
    if (currentCol < WORD_LENGTH) {
      const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
      tile.textContent = key;
      tile.classList.add('filled');
      currentGuess.push(key);
      currentCol++;
    }
  }
}

async function submitGuess() {
  const guess = currentGuess.join('');
  const guessHash = await sha256(guess);
  const isCorrect = guessHash === ANSWER_HASH;
  const colors = getColors(guess);

  colors.forEach((color, i) => {
    setTimeout(() => {
      const tile = document.getElementById(`tile-${currentRow}-${i}`);
      tile.classList.add('flip', color);
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
      showMessage('');
      showModal();
    } else {
      currentRow++;
      currentCol = 0;
      currentGuess = [];
      if (currentRow >= MAX_GUESSES) {
        gameOver = true;
        showMessage('Better luck next time!');
      }
    }
  }, WORD_LENGTH * 300 + 400);
}

function getColors(guess) {
  const answerArr = getRuntimeAnswer();
  const result = Array(WORD_LENGTH).fill('gray');
  const guessArr = guess.split('');
  guessArr.forEach((l, i) => {
    if (l === answerArr[i]) { result[i] = 'green'; answerArr[i] = null; }
  });
  guessArr.forEach((l, i) => {
    if (result[i] === 'green') return;
    const j = answerArr.indexOf(l);
    if (j !== -1) { result[i] = 'yellow'; answerArr[j] = null; }
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