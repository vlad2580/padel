const MAX_NAMED_PLAYERS = 16;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 16;

let players = [];
let count = 2;
let tournamentName = '';
const API_BASE = '/api';

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
  players = [''];
  renderPlayers();
  updateLimit();
}

function addPlayerRow() {
  if (players.length >= MAX_NAMED_PLAYERS) return;
  players.push('');
  renderPlayers();
  updateLimit();
}

function renderPlayers() {
  const namesContainer = document.getElementById('names-container');
  if (!namesContainer) return;
  namesContainer.innerHTML = '';

  players.forEach((value, index) => {
    const row = document.createElement('div');
    row.className = 'player-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Игрок ${index + 1}`;
    input.maxLength = 30;
    input.value = value;
    input.addEventListener('input', () => {
      players[index] = input.value.trim();
    });
    row.appendChild(input);

    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = '🗑';
    del.className = 'btn small secondary delete-player';
    del.addEventListener('click', () => {
      players.splice(index, 1);
      renderPlayers();
      updateLimit();
    });
    row.appendChild(del);

    if (index === players.length - 1) {
      const add = document.createElement('button');
      add.type = 'button';
      add.textContent = '+';
      add.className = 'btn small add-player';
      add.disabled = players.length >= MAX_NAMED_PLAYERS;
      add.addEventListener('click', addPlayerRow);
      row.appendChild(add);
    }

    namesContainer.appendChild(row);
  });
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
    updateCounter();
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

  const loadBtn = document.getElementById('load-tournament-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      window.location.href = 'tournaments.html';
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

    const createBtn = document.getElementById('create-btn');
    if (createBtn) {
      createBtn.addEventListener('click', async () => {
        const validationMsg = document.getElementById('validation-message');
        let total = 0;
        const type = document.querySelector('input[name="playerType"]:checked');
        if (type && type.value === 'names') {
          total = players.length;
        } else {
          total = count;
        }
        if (validationMsg) {
          if (total % 4 !== 0) {
            validationMsg.textContent = 'Количество игроков должно быть кратно 4';
            validationMsg.classList.remove('hidden');
            return;
          } else {
            validationMsg.classList.add('hidden');
          }
        }

        try {
          const res = await fetch(`${API_BASE}/tournaments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: tournamentName,
              player_count: total,
              type: type ? (type.value === 'names' ? 'with_names' : 'without_names') : 'without_names'
            })
          });
          if (res.ok) {
            alert(`Турнир "${tournamentName}" успешно создан!`);
            window.location.href = 'index.html';
          } else {
            const data = await res.json();
            alert(data.error || 'Ошибка создания');
          }
        } catch (err) {
          alert('Ошибка сети');
        }
      });
    }

    updateCounter();
  }

  const listEl = document.getElementById('tournaments-list');
  if (listEl) {
    fetch(`${API_BASE}/tournaments`)
      .then(r => r.json())
      .then(data => {
        listEl.innerHTML = '';
        data.forEach(t => {
          const li = document.createElement('li');
          const date = new Date(t.created_at).toLocaleString();
          li.textContent = `${t.name} (${date})`;
          listEl.appendChild(li);
        });
      })
      .catch(() => {
        listEl.innerHTML = '<li>Ошибка загрузки</li>';
      });
    const back = document.getElementById('back-index');
    if (back) {
      back.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }
});
