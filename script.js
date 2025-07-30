const newBtn = document.getElementById('new-tournament-btn');
const loadBtn = document.getElementById('load-tournament-btn');
const backBtn = document.getElementById('back-btn');
const startScreen = document.getElementById('start-screen');
const nameScreen = document.getElementById('name-screen');
const nameInput = document.getElementById('tournament-name-input');
const nameNextBtn = document.getElementById('name-next-btn');
const nameBackBtn = document.getElementById('name-back-btn');
const newScreen = document.getElementById('new-tournament');
const heading = document.getElementById('tournament-heading');
const typeRadios = document.querySelectorAll('input[name="playerType"]');
const counter = document.getElementById('counter');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const countSpan = document.getElementById('count');

let count = 2;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 64;
let tournamentName = '';

function showNameScreen() {
  startScreen.classList.add('hidden');
  nameScreen.classList.remove('hidden');
  nameInput.value = tournamentName;
  validateName();
}

function showNewTournament() {
  nameScreen.classList.add('hidden');
  newScreen.classList.remove('hidden');
  heading.textContent = tournamentName || 'Новый турнир';
}

function backToStart() {
  nameScreen.classList.add('hidden');
  newScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

function updateCounter() {
  countSpan.textContent = count;
  decreaseBtn.disabled = count <= MIN_PLAYERS;
  increaseBtn.disabled = count >= MAX_PLAYERS;
}

function validateName() {
  const value = nameInput.value.trim();
  const pattern = /^[A-Za-zА-Яа-я0-9- ]{3,50}$/u;
  const valid = pattern.test(value);
  nameNextBtn.disabled = !valid;
  return valid;
}

function handleTypeChange(e) {
  if (e.target.value === 'nonames') {
    counter.classList.remove('hidden');
  } else {
    counter.classList.add('hidden');
  }
}

typeRadios.forEach(r => r.addEventListener('change', handleTypeChange));
nameInput.addEventListener('input', validateName);

increaseBtn.addEventListener('click', () => {
  if (count < MAX_PLAYERS) {
    count++;
    updateCounter();
  }
});

decreaseBtn.addEventListener('click', () => {
  if (count > MIN_PLAYERS) {
    count--;
    updateCounter();
  }
});

newBtn.addEventListener('click', () => {
  showNameScreen();
});

nameBackBtn.addEventListener('click', () => {
  backToStart();
});

nameNextBtn.addEventListener('click', () => {
  if (validateName()) {
    tournamentName = nameInput.value.trim();
    showNewTournament();
  }
});

backBtn.addEventListener('click', () => {
  newScreen.classList.add('hidden');
  nameScreen.classList.remove('hidden');
  validateName();
});

updateCounter();

