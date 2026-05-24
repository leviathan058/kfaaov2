const QUESTIONS = [
  {
    question: 'What is my favorite food?',
    options: ['Beef pho', 'Spaghetti', 'Broken rice', 'Sushi'],
    answerHash: '92d878dc383ce5b57ab8694269c7236ce022eb9ed1b239f9d1c3a1589ea519aa'  
  },
  {
    question: 'Where was I born?',
    options: ['San Jose, CA', 'Berkeley, CA', 'Hayward, CA', 'Redwood City, CA'],
    answerHash: 'd3f42c1521ce2cf314c5775b942f0b69130edd4e73e90b29181f40aaea079aaa'  
  },
  {
    question: 'What is my favorite video game?',
    options: ['Minecraft', 'Valorant', 'League of Legends', 'Roblox'],
    answerHash: 'cd47ac9b83d30926ddfe3b42764ed387a157f281e30ee97b9fc09c882638001c'  
  },
  {
    question: 'What is my favorite Laufey song?',
    options: ['Forget-Me-Not', 'California and Me', 'Falling Behind', 'Castle in Hollywood'],
    answerHash: '52f0d0235cfd81d423c2481c65a342e019280628b260fe56fca5b85f50155955'  
  },
];

let current = 0;
let score = 0;
let answered = false;

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function renderQuestion() {
  const q = QUESTIONS[current];
  document.getElementById('question-num').textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  document.getElementById('question-text').textContent = q.question;
  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('trivia-opt');
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(opt, btn);
    opts.appendChild(btn);
  });
  answered = false;
  document.getElementById('trivia-message').textContent = '';
}

async function selectAnswer(optionText, btn) {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[current];
  const guessHash = await sha256(optionText.toUpperCase());
  const isCorrect = guessHash === q.answerHash;
  const allBtns = document.querySelectorAll('.trivia-opt');

  for (const b of allBtns) {
    const h = await sha256(b.textContent.toUpperCase());
    if (h === q.answerHash) { b.classList.add('trivia-correct'); break; }
  }

  if (!isCorrect) {
    btn.classList.add('trivia-wrong');
    document.getElementById('trivia-message').textContent = 'Wrong!';
  } else {
    score++;
    document.getElementById('trivia-message').textContent = 'Correct!';
  }

  setTimeout(() => {
    current++;
    if (current < QUESTIONS.length) renderQuestion();
    else showResult();
  }, 1200);
}

function showResult() {
  document.getElementById('question-num').textContent = '';
  document.getElementById('question-text').textContent = `You got ${score} / ${QUESTIONS.length}!`;
  document.getElementById('options').innerHTML = '';
  document.getElementById('trivia-message').textContent = '';
  if (score === QUESTIONS.length) {
    showModal();
  } else {
    document.getElementById('trivia-message').textContent = '';
  }
}

renderQuestion();

function showModal() {
  document.getElementById('modal-overlay').classList.add('active');
}