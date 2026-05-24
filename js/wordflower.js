const CENTER = 'H';
const VALID_WORDS = ['CHILI','CHILL','CLICHE','HEEL','HELL','HELM','HILL','LEECH','CHIME','MICHELLE'];
let petals = ['E','L','M','C','I'];
let currentWord = [];
let foundWords = [];

function shufflePetals() {
  for (let i = petals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [petals[i], petals[j]] = [petals[j], petals[i]];
  }
  buildFlower();
}

function buildFlower() {
  const container = document.getElementById('flower-container');
  container.innerHTML = '';

  
  const centerBtn = document.createElement('button');
  centerBtn.classList.add('petal', 'petal-center');
  centerBtn.textContent = CENTER;
  centerBtn.onclick = () => addLetter(CENTER);
  container.appendChild(centerBtn);

  
  petals.forEach((letter, i) => {
    const btn = document.createElement('button');
    btn.classList.add('petal', `petal-${i}`);
    btn.textContent = letter;
    btn.onclick = () => addLetter(letter);
    container.appendChild(btn);
  });
}

function addLetter(l) {
  currentWord.push(l);
  document.getElementById('wf-current').textContent = currentWord.join('');
}

function clearWord() {
  currentWord = [];
  document.getElementById('wf-current').textContent = '';
}

function submitWord() {
  const word = currentWord.join('');
  const msg = document.getElementById('wf-message');

  if (word.length < 3)              { msg.textContent = 'Too short!';                      clearWord(); return; }
  if (!word.includes(CENTER))       { msg.textContent = 'Must use the center letter H!';   clearWord(); return; }
  if (foundWords.includes(word))    { msg.textContent = 'Already found!';                  clearWord(); return; }
  if (!VALID_WORDS.includes(word))  { msg.textContent = 'Not a valid word.';               clearWord(); return; }

  foundWords.push(word);
  document.getElementById('wf-count').textContent = foundWords.length;
  msg.textContent = '';

  const tag = document.createElement('span');
  tag.classList.add('wf-tag');
  tag.textContent = word;
  document.getElementById('wf-found').appendChild(tag);
  clearWord();

  if (foundWords.length === VALID_WORDS.length) {
    showModal();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitWord();
  else if (e.key === 'Backspace') {
    currentWord.pop();
    document.getElementById('wf-current').textContent = currentWord.join('');
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    const l = e.key.toUpperCase();
    if (l === CENTER || petals.includes(l)) addLetter(l);
  }
});

buildFlower();

function showModal() {
  document.getElementById('modal-overlay').classList.add('active');
}