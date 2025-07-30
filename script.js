const newBtn = document.getElementById('new-tournament-btn');
const backBtn = document.getElementById('back-btn');
const startScreen = document.getElementById('start-screen');
const newScreen = document.getElementById('new-tournament');
const typeRadios = document.querySelectorAll('input[name="playerType"]');
const counter = document.getElementById('counter');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const countSpan = document.getElementById('count');

let count = 2;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 64;

function showNewTournament() {
  startScreen.classList.add('hidden');
  newScreen.classList.remove('hidden');
  document.querySelector('input[name="playerType"][value="names"]').checked = true;
  counter.classList.add('hidden');
  count = MIN_PLAYERS;
  updateCounter();
}

function backToStart() {
  newScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

function updateCounter() {
  countSpan.textContent = count;
  decreaseBtn.disabled = count <= MIN_PLAYERS;
  increaseBtn.disabled = count >= MAX_PLAYERS;
}

function handleTypeChange(e) {
  if (e.target.value === 'nonames') {
    counter.classList.remove('hidden');
  } else {
    counter.classList.add('hidden');
  }
}

typeRadios.forEach(r => r.addEventListener('change', handleTypeChange));

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
  showNewTournament();
});

backBtn.addEventListener('click', () => {
  backToStart();
});

updateCounter();

