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
const namesContainer = document.getElementById('names-container');
const limitMessage = document.getElementById('limit-message');

const MAX_NAMED_PLAYERS = 16;
let players = [];

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
  handleTypeChange({target: document.querySelector('input[name="playerType"]:checked')});
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

function initPlayers() {
  namesContainer.innerHTML = '';
  players = [];
  addPlayerRow();
}

function addPlayerRow() {
  if (players.length >= MAX_NAMED_PLAYERS) return;

  const existingAdd = namesContainer.querySelector('.add-player');
  if (existingAdd) existingAdd.remove();

  const number = players.length + 1;
  const row = document.createElement('div');
  row.className = 'player-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `Игрок ${number}`;
  input.maxLength = 30;
  input.addEventListener('input', () => {
    players[number - 1] = input.value.trim();
  });
  row.appendChild(input);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '+';
  btn.className = 'btn small add-player';
  btn.addEventListener('click', addPlayerRow);
  row.appendChild(btn);

  namesContainer.appendChild(row);
  players.push('');

  updateLimit();
}

function updateLimit() {
  const addBtn = namesContainer.querySelector('.add-player');
  if (players.length >= MAX_NAMED_PLAYERS) {
    if (addBtn) addBtn.disabled = true;
    limitMessage.textContent = 'Достигнуто максимальное количество игроков';
    limitMessage.classList.remove('hidden');
  } else {
    if (addBtn) addBtn.disabled = false;
    limitMessage.classList.add('hidden');
  }
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
    namesContainer.classList.add('hidden');
    limitMessage.classList.add('hidden');
  } else {
    counter.classList.add('hidden');
    namesContainer.classList.remove('hidden');
    if (players.length === 0) initPlayers();
    updateLimit();
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
handleTypeChange({target: document.querySelector('input[name="playerType"]:checked')});

