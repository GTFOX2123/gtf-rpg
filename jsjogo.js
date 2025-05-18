document.addEventListener("DOMContentLoaded", () => {
  // Variáveis do jogo
  let vidaJogador = 100;
  let vidaInimigo = 100;
  const inimigos = [
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

  const btnIniciar = document.getElementById("btn-iniciar");
  const btnAtacar = document.getElementById("btn-atacar");
  const btnDefender = document.getElementById("btn-defender");

  // Sons - opcional, se arquivos existirem
  const somAtaque = new Audio("audio/attack.mp3");
  const somDefesa = new Audio("audio/defend.mp3");
  const somVitoria = new Audio("audio/victory.mp3");
  const somDerrota = new Audio("audio/defeat.mp3");
  const somTheme = new Audio("audio/theme.mp3");
  somTheme.loop = true;

  btnIniciar.addEventListener("click", iniciarJogo);
  btnAtacar.addEventListener("click", atacar);
  btnDefender.addEventListener("click", defender);

  function iniciarJogo() {
    vidaJogador = 100;
    inimigoAtualIndex = 0;
    defendendo = false;

    telaInicial.style.display = "none";
    jogoDiv.style.display = "flex";

    carregarInimigo();
    atualizarVida();

    mensagemDiv.textContent = "Prepare-se para a batalha!";

    try {
      somTheme.play();
    } catch (e) {
      console.log("Erro ao tocar música:", e);
    }
  }

  function carregarInimigo() {
    if (inimigoAtualIndex >= inimigos.length) {
      mensagemDiv.textContent = "Parabéns! Você venceu todas as batalhas!";
      jogoDiv.style.display = "none";
      telaInicial.style.display = "block";
      somTheme.pause();
      return;
    }
    const inimigo = inimigos[inimigoAtualIndex];
    vidaInimigo = 100;
    imgInimigo.src = inimigo.img;
    imgInimigo.alt = inimigo.nome;
    atualizarVida();
  }

  function atualizarVida() {
    vidaJogadorSpan.textContent = vidaJogador;
    vidaInimigoSpan.textContent = vidaInimigo;
  }

  function atacar() {
    if (vidaJogador <= 0 || vidaInimigo <= 0) return;

    const dano = Math.floor(Math.random() * 20) + 10; // 10-29 de dano
    vidaInimigo -= dano;
    if (vidaInimigo < 0) vidaInimigo = 0;

    mensagemDiv.textContent = `Você atacou e causou ${dano} de dano!`;
    tocarSom(somAtaque);

    animarAtaque(imgJogador);
    atualizarVida();

    if (vidaInimigo === 0) {
      tocarSom(somVitoria);
      mensagemDiv.textContent = `Você derrotou ${inimigos[inimigoAtualIndex].nome}!`;
      inimigoAtualIndex++;

      setTimeout(() => {
        carregarInimigo();
        if (inimigoAtualIndex < inimigos.length) {
          mensagemDiv.textContent = "Prepare-se para a próxima batalha!";
        }
      }, 2000);

    } else {
      setTimeout(() => inimigoAtaca(), 1500);
    }
  }

  function defender() {
    if (vidaJogador <= 0 || vidaInimigo <= 0) return;

    defendendo = true;
    mensagemDiv.textContent = "Você está defendendo! O próximo ataque inimigo terá dano reduzido.";
    tocarSom(somDefesa);

    setTimeout(() => inimigoAtaca(), 1500);
  }

  function inimigoAtaca() {
    if (vidaJogador <= 0 || vidaInimigo <= 0) return;

    let dano = Math.floor(Math.random() * 20) + 10;
    if (defendendo) {
      dano = Math.floor(dano / 2);
      defendendo = false;
    }

    vidaJogador -= dano;
    if (vidaJogador < 0) vidaJogador = 0;

    mensagemDiv.textContent = `O inimigo atacou e causou ${dano} de dano!`;
    tocarSom(somAtaque);

    animarAtaque(imgInimigo);
    atualizarVida();

    if (vidaJogador === 0) {
      tocarSom(somDerrota);
      mensagemDiv.textContent = "Você foi derrotado! Tente novamente.";
      jogoDiv.style.display = "none";
      telaInicial.style.display = "block";
      somTheme.pause();
    }
  }

  function animarAtaque(elemento) {
    elemento.style.transition = "transform 0.2s";
    elemento.style.transform = "translateX(20px)";
    setTimeout(() => {
      elemento.style.transform = "translateX(0)";
    }, 200);
  }

  function tocarSom(som) {
    try {
      som.currentTime = 0;
      som.play();
    } catch {
      // Pode falhar se o som não carregar ou se o usuário não interagiu ainda
    }
  }
});
