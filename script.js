let player = null;
let enemy = null;
let gameOver = false;

const characters = {
  'Naruto': { hp: 100, attack: 15, defense: 5 },
  'Sasuke': { hp: 90, attack: 18, defense: 3 },
  'Sakura': { hp: 110, attack: 12, defense: 7 }
};

function selectCharacter(name) {
  player = {...characters[name]};
  enemy = createEnemy(name);
  document.getElementById('character-select').style.display = 'none';
  document.getElementById('battle').style.display = 'block';
  updateStatus();
  logMessage('Você escolheu ' + name + '!');
  logMessage('Seu oponente é ' + enemy.name + '!');
  gameOver = false;
  document.getElementById('attack-btn').style.display = 'inline-block';
  document.getElementById('reset-btn').style.display = 'none';
}

function createEnemy(playerName) {
  let names = Object.keys(characters).filter(n => n !== playerName);
  let enemyName = names[Math.floor(Math.random() * names.length)];
  return {name: enemyName, ...characters[enemyName]};
}

function updateStatus() {
  let status = `Você (${player.hp} HP) | Oponente (${enemy.hp} HP)`;
  document.getElementById('status').innerText = status;
}

function logMessage(msg) {
  let log = document.getElementById('log');
  log.innerHTML += '<div>' + msg + '</div>';
  log.scrollTop = log.scrollHeight;
}

function attack() {
  if(gameOver) return;
  let damageToEnemy = Math.max(player.attack - enemy.defense, 1);
  enemy.hp -= damageToEnemy;
  logMessage(`Você causou ${damageToEnemy} de dano em ${enemy.name}.`);
  if(enemy.hp <= 0) {
    enemy.hp = 0;
    updateStatus();
    logMessage('Você venceu a batalha!');
    gameOver = true;
    document.getElementById('attack-btn').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'inline-block';
    return;
  }

  let damageToPlayer = Math.max(enemy.attack - player.defense, 1);
  player.hp -= damageToPlayer;
  logMessage(`${enemy.name} causou ${damageToPlayer} de dano em você.`);
  if(player.hp <= 0) {
    player.hp = 0;
    updateStatus();
    logMessage('Você perdeu a batalha!');
    gameOver = true;
    document.getElementById('attack-btn').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'inline-block';
    return;
  }

  updateStatus();
}

function resetGame() {
  document.getElementById('log').innerHTML = '';
  document.getElementById('character-select').style.display = 'block';
  document.getElementById('battle').style.display = 'none';
  player = null;
  enemy = null;
  gameOver = false;
}
