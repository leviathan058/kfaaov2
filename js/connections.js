const GROUPS = [
  { category: 'Streets at Brown',  words: ['LLOYD','MEETING','BUTLER','POWER'],               color: '#538d4e' },
  { category: 'Cities in the Bay', words: ['HAYWARD','FREMONT','SUNNYVALE','SAN LEANDRO'],    color: '#b59f3b' },
  { category: 'Words before Ball', words: ['PICKLE','ODD','PAINT','SNOW'],                    color: '#4a90d9' },
  { category: 'Shades of Brown',   words: ['CHOCOLATE','OCHRE','SEPIA','BISTRE'],             color: '#9b59b6' }
];

let mistakes = 0;
let selected = [];
let solvedGroups = 0;
let allWords = GROUPS.flatMap(g => g.words);

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
  allWords.forEach(word => {
    const card = document.createElement('button');
    card.classList.add('conn-card');
    card.textContent = word;
    if (selected.includes(word)) card.classList.add('conn-selected');
    card.addEventListener('click', () => toggleSelect(word));
    grid.appendChild(card);
  });
  document.getElementById('submit-btn').disabled = selected.length !== 4;
}

function renderDots() {
  const dots = document.getElementById('dots');
  dots.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i >= 4 - mistakes) dot.classList.add('dot-used');
    dots.appendChild(dot);
  }
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
  const match = GROUPS.find(g =>
    selected.every(w => g.words.includes(w))
  );

  if (match) {
    solvedGroups++;

    const solvedEl = document.createElement('div');
    solvedEl.classList.add('solved-group');
    solvedEl.style.background = match.color;
    solvedEl.innerHTML = `<strong>${match.category}</strong><span>${match.words.join(', ')}</span>`;
    document.getElementById('solved-groups').appendChild(solvedEl);

    allWords = allWords.filter(w => !selected.includes(w));
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