const MAX_NAMED_PLAYERS = 16;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 64;

let players = [];
let count = 2;
let tournamentName = '';

function updateCounter() {
  const countSpan = document.getElementById('count');
  const decreaseBtn = document.getElementById('decrease');
  const increaseBtn = document.getElementById('increase');
  if (!countSpan || !decreaseBtn || !increaseBtn) return;
  countSpan.textContent = count;
  decreaseBtn.disabled = count <= MIN_PLAYERS;
  increaseBtn.disabled = count >= MAX_PLAYERS;
}

function initPlayers() {
  const namesContainer = document.getElementById('names-container');
  if (!namesContainer) return;
  namesContainer.innerHTML = '';
  players = [];
  addPlayerRow();
}

function addPlayerRow() {
  const namesContainer = document.getElementById('names-container');
  const limitMessage = document.getElementById('limit-message');
  if (!namesContainer || players.length >= MAX_NAMED_PLAYERS) return;

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
  const namesContainer = document.getElementById('names-container');
  const limitMessage = document.getElementById('limit-message');
  if (!namesContainer || !limitMessage) return;
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
  const nameInput = document.getElementById('tournament-name-input');
  const nextBtn = document.getElementById('name-next-btn');
  if (!nameInput) return false;
  const value = nameInput.value.trim();
  const pattern = /^[A-Za-zА-Яа-я0-9- ]{3,50}$/u;
  const valid = pattern.test(value);
  if (nextBtn) nextBtn.disabled = !valid;
  return valid;
}

function handleTypeChange(e) {
  const counter = document.getElementById('counter');
  const namesContainer = document.getElementById('names-container');
  const limitMessage = document.getElementById('limit-message');
  if (!counter || !namesContainer || !limitMessage) return;
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

document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('new-tournament-btn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      window.location.href = 'name.html';
    });
  }

  const nameInput = document.getElementById('tournament-name-input');
  if (nameInput) {
    nameInput.value = localStorage.getItem('tournamentName') || '';
    validateName();
    nameInput.addEventListener('input', validateName);

    const nextBtn = document.getElementById('name-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateName()) {
          localStorage.setItem('tournamentName', nameInput.value.trim());
          window.location.href = 'type.html';
        }
      });
    }

    const backBtn = document.getElementById('name-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }

  const heading = document.getElementById('tournament-heading');
  if (heading) {
    tournamentName = localStorage.getItem('tournamentName') || '';
    heading.textContent = tournamentName || 'Новый турнир';

    const typeRadios = document.querySelectorAll('input[name="playerType"]');
    typeRadios.forEach(r => r.addEventListener('change', handleTypeChange));
    if (typeRadios.length) {
      handleTypeChange({ target: document.querySelector('input[name="playerType"]:checked') });
    }

    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        if (count < MAX_PLAYERS) {
          count++;
          updateCounter();
        }
      });
    }
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        if (count > MIN_PLAYERS) {
          count--;
          updateCounter();
        }
      });
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'name.html';
      });
    }

    updateCounter();
  }
});
