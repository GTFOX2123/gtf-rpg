document.addEventListener("DOMContentLoaded", function () {
  let vidaJogador = 100;
  let vidaInimigo = 100;

  const inimigos = [
    { nome: "Sasuke", img: "img/sasuke.png" },
    { nome: "Gaara", img: "img/gaara.png" },
    { nome: "Itachi", img: "img/itachi.png" }
  ];
  let inimigoAtual = 0;
  let defendendo = false;

  const telaInicial = document.getElementById("tela-inicial");
  const jogo = document.getElementById("jogo");
  const vidaJogadorSpan = document.getElementById("vida-jogador");
  const vidaInimigoSpan = document.getElementById("vida-inimigo");
  const imgInimigo = document.getElementById("img-inimigo");
  const mensagem = document.getElementById("mensagem");

  document.getElementById("btn-iniciar").addEventListener("click", iniciarJogo);
  document.getElementById("btn-atacar").addEventListener("click", atacar);
  document.getElementById("btn-defender").addEventListener("click", defender);

  function iniciarJogo() {
    vidaJogador = 100;
    inimigoAtual = 0;
    carregarInimigo();
    atualizarVida();
    telaInicial.style.display = "none";
    jogo.style.display = "flex";
    mensagem.textContent = "Batalha iniciada! Ataque o inimigo!";
    defendendo = false;
  }

  function carregarInimigo() {
    if (inimigoAtual >= inimigos.length) {
      mensagem.textContent = "Parabéns! Você venceu todas as batalhas!";
      jogo.style.display = "none";
      telaInicial.style.display = "block";
      return;
    }
    const inimigo = inimigos[inimigoAtual];
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

    let dano = Math.floor(Math.random() * 20) + 10;
    vidaInimigo -= dano;
    if (vidaInimigo < 0) vidaInimigo = 0;
    mensagem.textContent = `Você atacou e causou ${dano} de dano!`;
    atualizarVida();

    if (vidaInimigo === 0) {
      mensagem.textContent = `Você derrotou ${inimigos[inimigoAtual].nome}!`;
      inimigoAtual++;
      setTimeout(() => {
        carregarInimigo();
        mensagem.textContent = "Prepare-se para a próxima batalha!";
      }, 2000);
    } else {
      setTimeout(inimigoAtaca, 1500);
    }
  }

  function defender() {
    if (vidaJogador <= 0 || vidaInimigo <= 0) return;
    defendendo = true;
    mensagem.textContent = "Você está defendendo! Dano inimigo será reduzido.";
    setTimeout(inimigoAtaca, 1500);
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
    mensagem.textContent = `O inimigo atacou e causou ${dano} de dano!`;
    atualizarVida();

    if (vidaJogador === 0) {
      mensagem.textContent = "Você foi derrotado! Recarregue para tentar novamente.";
      jogo.style.display = "none";
      telaInicial.style.display = "block";
    }
  }
});
