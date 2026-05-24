const CLUES = ['Bananas', 'Steak fries', 'Cilantro rice', 'Chicken tikka masala', 'Smoked salmon cream cheese'];
const ANSWER = 'RAT';

let revealed = 1;

function buildCard() {
  const card = document.getElementById('clue-card');
  card.innerHTML = '';
  for (let i = 0; i < CLUES.length; i++) {
    const row = document.createElement('div');
    row.id = `clue-row-${i}`;
    card.appendChild(row);
  }
}

function render() {
  for (let i = 0; i < CLUES.length; i++) {
    const row = document.getElementById(`clue-row-${i}`);
    if (i < revealed) {
      row.textContent = CLUES[i];
      row.className = `clue-row clue-row-${i + 1}${i === 0 ? ' revealed-first' : ' revealed'}`;
    } else {
      row.textContent = `CLUE ${i + 1}`;
      row.className = `clue-row clue-row-${i + 1} hidden`;
    }
  }
  document.getElementById('pin-counter').textContent = `${revealed} of ${CLUES.length}`;
}

function submitPin() {
  const input = document.getElementById('pin-guess');
  const guess = input.value.trim().toUpperCase();
  if (!guess) return;

  if (guess.includes(ANSWER)) {
    showModal();
  } else {
    if (revealed < CLUES.length) {
      revealed++;
      render();
    }
    input.value = '';
  }
}

document.getElementById('pin-guess').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitPin();
});

buildCard();
render();

function showModal() {
  document.getElementById('modal-overlay').classList.add('active');
}