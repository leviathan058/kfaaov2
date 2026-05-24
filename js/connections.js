const GROUPS = [
  { category: 'Streets at Brown',  words: ['LLOYD','MEETING','BUTLER','POWER'],                  color: '#538d4e' },
  { category: 'Cities in the Bay', words: ['HAYWARD','FREMONT','SUNNYVALE','SAN LEANDRO'],       color: '#b59f3b' },
  { category: 'Words before Ball', words: ['PICKLE','ODD','PAINT','SNOW'],                       color: '#4a90d9' },
  { category: 'Shades of Brown',   words: ['CHOCOLATE','OCHRE','SEPIA','BISTRE'],                color: '#9b59b6' }
];
const RESULT_CODE = 'YOUR_CODE_HERE';
const MAX_MISTAKES = 4;

let mistakes = 0;
let selected = [];
let solvedGroups = 0;
let allWords = GROUPS.flatMap(g => g.words.map(w => ({ word: w, group: g })));

function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function shuffle() { shuffleArr(allWords); renderGrid(); }

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  allWords.forEach(item => {
    const card = document.createElement('button');
    card.classList.add('conn-card');
    card.textContent = item.word;
    if (selected.includes(item.word)) card.classList.add('conn-selected');
    card.addEventListener('click', () => toggleSelect(item.word));
    grid.appendChild(card);
  });
  updateSubmit();
}

function renderDots() {
  const dots = document.getElementById('dots');
  dots.innerHTML = '';
  for (let i = 0; i < MAX_MISTAKES; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i >= MAX_MISTAKES - mistakes) dot.classList.add('dot-used');
    dots.appendChild(dot);
  }
}

function updateSubmit() {
  document.getElementById('submit-btn').disabled = selected.length !== 4;
}

function toggleSelect(word) {
  if (selected.includes(word)) {
    selected = selected.filter(w => w !== word);
  } else {
    if (selected.length >= 4) return;
    selected.push(word);
  }
  renderGrid();
}

function submitGuess() {
  if (selected.length !== 4) return;

  const match = GROUPS.find(g =>
    selected.every(w => g.words.includes(w)) && g.words.every(w => selected.includes(w))
  );

  if (match) {
    if (match.solved) return;
    match.solved = true;
    solvedGroups++;

    const solvedEl = document.createElement('div');
    solvedEl.classList.add('solved-group');
    solvedEl.style.background = match.color;
    solvedEl.innerHTML = `<strong>${match.category}</strong><span>${match.words.join(', ')}</span>`;
    document.getElementById('solved-groups').appendChild(solvedEl);

    allWords = allWords.filter(item => !selected.includes(item.word));
    selected = [];
    renderGrid();

    if (solvedGroups === GROUPS.length) {
      document.getElementById('grid').style.display = 'none';
      document.getElementById('controls').style.display = 'none';
      document.getElementById('mistakes-wrap').style.display = 'none';
      showModal();
    }
  } else {
    
    const cards = document.querySelectorAll('.conn-selected');
    cards.forEach(card => {
      card.classList.remove('conn-shake');
      void card.offsetWidth; 
      card.classList.add('conn-shake');
      card.addEventListener('animationend', () => card.classList.remove('conn-shake'), { once: true });
    });

    mistakes++;
    renderDots();
    selected = [];

    setTimeout(() => renderGrid(), 460); 
  }
}

shuffleArr(allWords);
renderGrid();
renderDots();

function showModal() {
  document.getElementById('modal-overlay').classList.add('active');
}