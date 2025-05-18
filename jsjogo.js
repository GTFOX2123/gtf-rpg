// Variáveis do jogo
let vidaJogador = 100;
let vidaInimigo = 100;
let inimigos = [
  { nome: "Sasuke", img: "img/sasuke.png" },
  { nome: "Gaara", img: "img/gaara.png" },
  { nome: "Itachi", img: "img/itachi.png" }
];
let inimigoAtualIndex = 0;
let defendendo = false;

// Elementos DOM
const telaInicial = document.getElementById("tela-inicial");
const jogoDiv = document.getElementById("jogo");
const imgJogador = document.getElementById("img-jogador");
const imgInimigo = document.getElementById("img-inimigo");
const vidaJogadorSpan = document.getElementById("vida-jogador");
const vidaInimigoSpan = document.getElementById("vida-inimigo");
const mensagemDiv = document.getElementById("mensagem");

const somTheme = document.getElementById("theme");

const somAtaque = new Audio("audio/attack.mp3");
const somDefesa = new Audio("audio/defend.mp3");
const somVitoria = new Audio("audio/victory.mp3");
const somDerrota = new Audio("audio/defeat.mp3");

// Função para iniciar o jogo
function iniciarJogo() {
  vidaJogador = 100;
  vidaInimigo = 100;
  inimigoAtualIndex = 0;
  defendendo = false;
  telaInicial.style.display = "none";
  jogoDiv.style.display = "flex";
  atualizarInimigo();
  atualizarVida();
  mensagemDiv.textContent = "Prepare-se para a batalha!";
  somTheme.play();
}

// Atualiza o inimigo atual
function atualizarInimigo() {
  let inimigo = inimigos[inimigoAtualIndex];
  imgInimigo.src = inimigo.img;
  imgInimigo.alt = inimigo.nome;
  vidaInimigo = 100;
  vidaInimigoSpan.textContent = vidaInimigo;
}

// Atualiza as barras de vida
function atualizarVida() {
  vidaJogadorSpan.textContent = vidaJogador;
  vidaInimigoSpan.textContent = vidaInimigo;
}

// Função de ataque do jogador
function atacar() {
  if (vidaJogador <= 0 || vidaInimigo <= 0) return;

  let dano = Math.floor(Math.random() * 20) + 10; // Dano entre 10 e 30
  vidaInimigo -= dano;
  if (vidaInimigo < 0) vidaInimigo = 0;

  mensagemDiv.textContent = `Você atacou o inimigo causando ${dano} de dano!`;
  somAtaque.play();

  atualizarVida();
  animarAtaque(imgJogador);

  if (vidaInimigo === 0) {
    somVitoria.play();
    mensagemDiv.textContent = `Você derrotou ${inimigos[inimigoAtualIndex].nome}!`;
    inimigoAtualIndex++;
    if (inimigoAtualIndex >= inimigos.length) {
      mensagemDiv.textContent += " Parabéns, você venceu todas as batalhas!";
      jogoDiv.style.display = "none";
      telaInicial.style.display = "block";
      somTheme.pause();
    } else {
      setTimeout(() => {
        atualizarInimigo();
        mensagemDiv.textContent = "Prepare-se para a próxima batalha!";
      }, 2000);
    }
  } else {
    setTimeout(() => {
      inimigoAtaca();
    }, 1500);
  }
}

// Função de defesa do jogador
function defender() {
  if (vidaJogador <= 0 || vidaInimigo <= 0) return;

  defendendo = true;
  mensagemDiv.textContent = "Você está defendendo! Reduzindo dano do próximo ataque.";
  somDefesa.play();

  setTimeout(() => {
    inimigoAtaca();
  }, 1500);
}

// Função do inimigo atacar
function inimigoAtaca() {
  if (vidaJogador <= 0 || vidaInimigo <= 0) return;

  let dano = Math.floor(Math.random() * 20) + 10;
  if (defendendo) {
    dano = Math.floor(dano / 2);
    defendendo = false;
  }

  vidaJogador -= dano;
  if (vidaJogador < 0) vidaJogador = 0;

  mensagemDiv.textContent = `O inimigo atacou causando ${dano} de dano!`;
  somAtaque.play();

  atualizarVida();
  animarAtaque(imgInimigo);

  if (vidaJogador === 0) {
    somDerrota.play();
    mensagemDiv.textContent = "Você foi derrotado! Tente novamente.";
    jogoDiv.style.display = "none";
    telaInicial.style.display = "block";
    somTheme.pause();
  }
}

// Função simples de animação de ataque
function animarAtaque(imgElement) {
  imgElement.style.transition = "transform 0.2s";
  imgElement.style.transform = "translateX(20px)";
  setTimeout(() => {
    imgElement.style.transform = "translateX(0)";
  }, 200);
}
