let player = null;
let enemy = null;
let gameOver = false;

const characters = {
  'Naruto': { hp: 100, attack: 15, defense: 5, className: 'naruto' },
  'Sasuke': { hp: 90, attack: 18, defense: 3, className: 'sasuke' },
  'Sakura': { hp: 110, attack: 12, defense: 7, className: 'sakura' }
};

const playerCharEl = document.getElementById('player-character');
const enemyCharEl = document.getElementById('enemy-character');
const statusEl = document.getElementById('status');
const logEl = document.getElementById('log');
const attackBtn = document.getElementById('attack-btn');
const resetBtn = document.getElementById('reset-btn');

function selectCharacter(name) {
  player = {...characters[name]};
  enemy = createEnemy(name);
  document.getElementById('character-select').style.display = 'none';
  document.getElementById('battle').style.display = 'block';

  // Set classes for visuals
  playerCharEl.className = 'character ' + player.className;
  enemyCharEl.className = 'character ' + enemy.className;

  updateStatus();
  logMessage('Você escolheu ' + name + '!');
  logMessage('Seu oponente é ' + enemy.name + '!');
  gameOver = false;
  attackBtn.style.display = 'inline-block';
  resetBtn.style.display = 'none';
}

function createEnemy(playerName) {
  let names = Object.keys(characters).filter(n => n !== playerName);
  let enemyName = names[Math.floor(Math.random() * names.length)];
  let char = {...characters[enemyName]};
  char.name = enemyName;
  char.className = characters[enemyName].className;
  return char;
}

function updateStatus() {
  statusEl.innerHTML = `
    <div>Você: ${player.hp} HP</div>
    <div>Oponente: ${enemy.hp} HP</div>
  `;
}

function logMessage(msg) {
  logEl.innerHTML += `<div>${msg}</div>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function animateAttack(attackerEl, defenderEl, callback) {
  attackerEl.classList.add('attacking');
  setTimeout(() => {
    attackerEl.classList.remove('attacking');
    defenderEl.classList.add('hurt');
    setTimeout(() => {
      defenderEl.classList.remove('hurt');
      callback();
    }, 300);
  }, 400);
}

function attack() {
  if(gameOver) return;

  attackBtn.disabled = true;

  // Jogador ataca inimigo
  let damageToEnemy = Math.max(player.attack - enemy.defense, 1);

  animateAttack(playerCharEl, enemyCharEl, () => {
    enemy.hp -= damageToEnemy;
    if(enemy.hp < 0) enemy.hp = 0;
    logMessage(`Você causou ${damageToEnemy} de dano em ${enemy.name}.`);
    updateStatus();

    if(enemy.hp === 0) {
      logMessage('Você venceu a batalha!');
      endGame(true);
      return;
    }

    // Inimigo ataca jogador
    let damageToPlayer = Math.max(enemy.attack - player.defense, 1);

    animateAttack(enemyCharEl, playerCharEl, () => {
      player.hp -= damageToPlayer;
      if(player.hp < 0) player.hp = 0;
      logMessage(`${enemy.name} causou ${damageToPlayer} de dano em você.`);
      updateStatus();

      if(player.hp === 0) {
        logMessage('Você perdeu a batalha!');
        endGame(false);
        return;
      }

      attackBtn.disabled = false;
    });
  });
}

function endGame(playerWon) {
  gameOver = true;
  attackBtn.style.display = 'none';
  resetBtn.style.display = 'inline-block';
  attackBtn.disabled = false;
}

function resetGame() {
  logEl.innerHTML = '';
  document.getElementById('character-select').style.display = 'block';
  document.getElementById('battle').style.display = 'none';
  player = null;
  enemy = null;
  gameOver = false;
}
