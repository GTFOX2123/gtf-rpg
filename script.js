const player = {
  name: 'Naruto',
  maxHp: 100,
  hp: 100,
  attack: 20,
  defense: 6,
  xp: 0,
  level: 1,
  items: { healingScroll: 3 },
  element: {
    sprite: document.getElementById('player-sprite'),
    hpBar: document.getElementById('player-hp'),
    hpText: document.getElementById('player-hp-text')
  }
};

const enemyBaseStats = {
  name: 'Sasuke',
  maxHp: 90,
  hp: 90,
  attack: 18,
  defense: 5,
  element: {
    sprite: document.getElementById('enemy-sprite'),
    hpBar: document.getElementById('enemy-hp'),
    hpText: document.getElementById('enemy-hp-text')
  }
};

let enemy = {...enemyBaseStats};
let isPlayerTurn = true;
const battleLog = document.getElementById('battle-log');
const attackBtn = document.getElementById('attack-btn');
const defendBtn = document.getElementById('defend-btn');
const itemBtn = document.getElementById('item-btn');
const levelDisplay = document.getElementById('level-display');
const gameOverDiv = document.getElementById('game-over');
const gameOverMsg = document.getElementById('game-over-message');
const restartBtn = document.getElementById('restart-btn');

function updateHpBar(character) {
  const hpPercent = (character.hp / character.maxHp) * 100;
  character.element.hpBar.style.width = hpPercent + '%';
  character.element.hpText.textContent = `${character.hp} / ${character.maxHp}`;
}

function log(message) {
  const div = document.createElement('div');
  div.textContent = message;
  battleLog.appendChild(div);
  battleLog.scrollTop = battleLog.scrollHeight;
}

function animateSprite(character, action, duration=600) {
  character.element.sprite.classList.remove('idle','attack','hurt');
  character.element.sprite.classList.add(action);
  return new Promise(resolve => {
    setTimeout(() => {
      character.element.sprite.classList.remove(action);
      character.element.sprite.classList.add('idle');
      resolve();
    }, duration);
  });
}

function playerAttack() {
  let damage = Math.max(player.attack - enemy.defense, 1);
  enemy.hp -= damage;
  if(enemy.hp < 0) enemy.hp = 0;
  log(`Você causou ${damage} de dano em ${enemy.name}.`);
  updateHpBar(enemy);
  return damage;
}

function enemyAttack() {
  let damage = Math.max(enemy.attack - player.defense, 1);
  player.hp -= damage;
  if(player.hp < 0) player.hp = 0;
  log(`${enemy.name} causou ${damage} de dano em você.`);
  updateHpBar(player);
  return damage;
}

function enemyDecision() {
  // Inimigo escolhe atacar ou defender (30% chance defender)
  return Math.random() < 0.3 ? 'defend' : 'attack';
}

async function enemyTurn() {
  isPlayerTurn = false;
  attackBtn.disabled = true;
  defendBtn.disabled = true;
  itemBtn.disabled = true;

  let decision = enemyDecision();
  if(decision === 'defend') {
    log(`${enemy.name} está se defendendo!`);
    await animateSprite(enemy, 'attack', 400); // usar attack animação pra defender tb
  } else {
    await animateSprite(enemy, 'attack');
    enemyAttack();
  }

  if(player.hp === 0) {
    endGame(false);
  } else {
    isPlayerTurn = true;
    attackBtn.disabled = false;
    defendBtn.disabled = false;
    itemBtn.disabled = false;
  }
}

async function playerTurn(action) {
  if(!isPlayerTurn) return;

  attackBtn.disabled = true;
  defendBtn.disabled = true;
  itemBtn.disabled = true;

  switch(action) {
    case 'attack':
      await animateSprite(player, 'attack');
      playerAttack();
      break;
    case 'defend':
      log('Você está se defendendo este turno!');
      break;
    case 'item':
      if(player.items.healingScroll > 0) {
        player.hp += 30;
        if(player.hp > player.maxHp) player.hp = player.maxHp;
        player.items.healingScroll--;
        log('Você usou um Pergaminho de Cura e recuperou 30 HP!');
        updateHpBar(player);
      } else {
        log('Você não tem Pergaminhos de Cura sobrando!');
      }
      break;
  }

  if(enemy.hp === 0) {
    endGame(true);
  } else {
    await enemyTurn();
  }
}

function endGame(playerWon) {
  gameOverDiv.style.display = 'flex';
  if(playerWon) {
    gameOverMsg.textContent = 'Parabéns! Você venceu!';
  } else {
    gameOverMsg.textContent = 'Você foi derrotado! Tente novamente.';
  }
}

function restartGame() {
  player.hp = player.maxHp;
  player.items.healingScroll = 3;
  enemy.hp = enemy.maxHp;
  battleLog.innerHTML = '';
  updateHpBar(player);
  updateHpBar(enemy);
  gameOverDiv.style.display = 'none';
  isPlayerTurn = true;
  attackBtn.disabled = false;
  defendBtn.disabled = false;
  itemBtn.disabled = false;
  log('Jogo reiniciado! Boa sorte!');
}

attackBtn.onclick =
