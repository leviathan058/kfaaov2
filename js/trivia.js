const QUESTIONS = [
  {
    question: 'What is my favorite food?',
    options: ['Beef pho', 'Spaghetti', 'Broken rice', 'Sushi'],
    answer: 'SUSHI'
  },
  {
    question: 'Where was I born?',
    options: ['San Jose, CA', 'Berkeley, CA', 'Hayward, CA', 'Redwood City, CA'],
    answer: 'BERKELEY, CA'
  },
  {
    question: 'What is my favorite video game?',
    options: ['Minecraft', 'Valorant', 'League of Legends', 'Roblox'],
    answer: 'MINECRAFT'
  },
  {
    question: 'What is my favorite Laufey song?',
    options: ['Forget-Me-Not', 'California and Me', 'Falling Behind', 'Castle in Hollywood'],
    answer: 'FORGET-ME-NOT'
  },
];

let current = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const q = QUESTIONS[current];
  document.getElementById('question-num').textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  document.getElementById('question-text').textContent = q.question;
  document.getElementById('trivia-message').textContent = '';
  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('trivia-opt');
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(opt, btn);
    opts.appendChild(btn);
  });
  answered = false;
}

function selectAnswer(optionText, btn) {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[current];
  const isCorrect = optionText.toUpperCase() === q.answer;

  document.querySelectorAll('.trivia-opt').forEach(b => {
    if (b.textContent.toUpperCase() === q.answer) b.classList.add('trivia-correct');
  });

  if (isCorrect) {
    score++;
    document.getElementById('trivia-message').textContent = 'Correct!';
  } else {
    btn.classList.add('trivia-wrong');
    document.getElementById('trivia-message').textContent = 'Wrong!';
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
  if (score === QUESTIONS.length) showModal();
}

function showModal() {
  document.getElementById('modal-overlay').classList.add('active');
}

renderQuestion();