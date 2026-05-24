// ── EDIT YOUR CONTENT HERE ──────────────────────────────────────
const CLUES = ['Bananas', 'Steak fries', 'Cilantro rice', 'Chicken tikka masala', 'Smoked salmon cream cheese'];
const ANSWER_HASH = '884855a5147da4eea530f1b9cb3358bcb723fc8a86c8d7b9ac35ae86e6c0ef74';
// ───────────────────────────────────────────────────────────────

let revealed = 1;
let solved = false;

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

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

async function submitPin() {
  if (solved) return;
  const guess = document.getElementById('pin-guess').value.trim().toUpperCase();
  const msg = document.getElementById('pin-message');
  if (!guess) return;

  if (guess.includes('RAT')) {
    solved = true;
    msg.textContent = '';
    msg.style.color = '#4ecfaa';
    showModal();
  } else {
    msg.textContent = '';
    msg.style.color = '#e05555';
    if (revealed < CLUES.length) {
      revealed++;
      render();
    }
    document.getElementById('pin-guess').value = '';
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