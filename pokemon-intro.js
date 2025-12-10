document.addEventListener("DOMContentLoaded", () => {
  const battleSection = document.getElementById("pokemon-section");
  if (!battleSection) return;

  const loadingScreen = battleSection.querySelector(".loading-screen");
  const loadingBarFill = battleSection.querySelector(".loading-bar-fill");
  const introTextBox = battleSection.querySelector(".intro-text-box");
  const introPokemon = battleSection.querySelector(".intro-pokemon");

  if (!loadingBarFill || !loadingScreen) return;

  const battleBgm = new Audio("sound/Battle.mp3");
  battleBgm.loop = true;
  battleBgm.volume = 0.6;

  window.battleBgm = battleBgm;

  loadingBarFill.addEventListener("animationend", () => {
    loadingScreen.style.display = "none";

    battleSection.classList.add("battle-bg");

    if (introTextBox) introTextBox.classList.add("show");
    if (introPokemon) introPokemon.classList.add("show");

    battleBgm.currentTime = 0;
    battleBgm.play();

    if (typeof window.startBattleIntro === "function") {
      window.startBattleIntro();
    }
  });
});


