document.addEventListener("DOMContentLoaded", () => {
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

  const barraVidaJogador = document.getElementById("barra-vida-jogador");
  const barraVidaInimigo = document.getElementById("barra-vida-inimigo");

  const imgJogador = document.getElementById("img-jogador");
  const imgInimigo = document.getElementById("img-inimigo");

  const mensagem = document.getElementById("mensagem");

  const btnIniciar = document.getElementById("btn-iniciar");
  const btnAtacar = document.getElementById("btn-atacar");
  const btnDefender = document.getElementById("btn-defender");

  btnIniciar.addEventListener("click", iniciarJogo);
  btnAtacar.addEventListener("click", () => acaoJogador("atacar"));
  btnDefender.addEventListener("click", () => acaoJogador("defender"));

  function iniciarJogo() {
    vidaJogador = 100;
    inimigoAtual = 0;
    carregarInimigo();

    atualizarVida();
    mensagem.textContent = "Batalha iniciada! Ataque o inimigo!";

    telaInicial.style.display = "none";
    jogo.style.display = "flex";

    habilitarBotoes(true);
    defendendo = false;
  }

  function carregarInimigo() {
    if (inimigoAtual >= inimigos.length) {
      mensagem.textContent = "Parabéns! Você venceu todas as batalhas!";
      jogo.style.display = "none";
      telaInicial.style.display = "flex";
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

    barraVidaJogador.style.width = `${vidaJogador}%`;
    barraVidaInimigo.style.width = `${vidaInimigo}%`;
  }

  function habilitarBotoes(valor) {
    btnAtacar.disabled = !valor;
    btnDefender.disabled = !valor;
  }

  function acaoJogador(acao) {
    if (vidaJogador <= 0 || vidaInimigo <= 0) return;

    habilitarBotoes(false);

    if (acao === "atacar") {
      atacar();
    } else if (acao === "defender") {
      defender();
    }
  }

  function atacar() {
    // anima ataque
    imgJogador.classList.add("piscar");

    let dano = Math.floor(Math.random() * 20) + 10;
    vidaInimigo -= dano;
    if (vidaInimigo < 0) vidaInimigo = 0;

    mensagem.textContent = `Você atacou e causou ${dano} de dano!`;
    atualizarVida();

    setTimeout(() => {
      imgJogador.classList.remove("piscar");
      if (vidaInimigo === 0) {
        mensagem.textContent = `Você derrotou ${inimigos[inimigoAtual].nome}!`;
        inimigoAtual++;
        setTimeout(() => {
          carregarInimigo();
          mensagem.textContent = "Prepare-se para a próxima batalha!";
          habilitarBotoes(true);
        }, 2000);
      } else {
        setTimeout(inimigoAtaca, 1500);
      }
    }, 600);
  }

  function defender() {
    defendendo = true;
    mensagem.textContent = "Você está defendendo! Dano inimigo será reduzido.";
    setTimeout(inimigoAtaca, 1500);
  }

  function inimigoAtaca() {
    if (vidaJogador <= 0 || vidaInimigo <= 0) return;

    // anima ataque inimigo
    imgInimigo.classList.add("piscar");

    let dano = Math.floor(Math.random() * 20) + 10;
    if (defendendo) {
      dano = Math.floor(dano / 2);
      defendendo = false;
    }

    vidaJogador -= dano;
    if (vidaJogador < 0) vidaJogador = 0;

    setTimeout(() => {
      imgInimigo.classList.remove("piscar");
      mensagem.textContent = `O inimigo atacou e causou ${dano} de dano!`;
      atualizarVida();

      if (vidaJogador === 0) {
        mensagem.textContent = "Você foi derrotado! Recarregue para tentar novamente.";
        jogo.style.display = "none";
        telaInicial.style.display = "flex";
      } else {
        habilitarBotoes(true);
      }
    }, 600);
  }
});
