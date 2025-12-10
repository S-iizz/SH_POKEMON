if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  const gameChip = document.getElementById("game-chip");
  const switchOff = document.getElementById("switch-off");
  const pokemonSoft = document.getElementById("pokemon-soft");
  const introWrapper = document.querySelector(".intro-wrapper");
  const battleSection = document.getElementById("pokemon-section");

  // 고양이 인트로
  const introCatWrapper = document.querySelector(".intro-cat-wrapper");
  const startText = document.querySelector(".intro-start-text");

  // 인트로 사운드
  const introDropAudio = new Audio("sound/IntroDrop.mp3");  // 게임 칩 달칵
  const introNextAudio = new Audio("sound/IntroNext.wav");  // 인트로 사운드

  introDropAudio.loop = false;
  introNextAudio.loop = false;

  introDropAudio.volume = 0.8;
  introNextAudio.volume = 0.8;

  function playIntroAudioSequence() {
    introDropAudio.currentTime = 0;
    introNextAudio.currentTime = 0;

    introDropAudio.onended = null;

    introDropAudio.onended = () => {
      introNextAudio.play().catch(() => { });
    };

    introDropAudio.play().catch(() => {
    });
  }

  function stopIntroAudio() {
    introDropAudio.pause();
    introNextAudio.pause();
    introDropAudio.currentTime = 0;
    introNextAudio.currentTime = 0;
  }

  let tiltActive = false;
  let introStarted = false;


  function startChipIntro() {
    if (introStarted) return;
    introStarted = true;

    if (introCatWrapper) {
      introCatWrapper.classList.add("fade-out");
      setTimeout(() => {
        introCatWrapper.style.display = "none";
      }, 600);
    }

    // 게임칩 등장
    if (gameChip) {
      setTimeout(() => {
        gameChip.classList.add("enter");
      }, 300);
    }
  }

  if (gameChip) {
    gameChip.addEventListener("animationend", (event) => {
      if (event.animationName === "chip-spin") {
        if (switchOff) {
          switchOff.classList.add("show");
        }

        // 게임칩 떨어지는 연출
        setTimeout(() => {
          gameChip.classList.remove("enter");
          gameChip.classList.add("fall");

          playIntroAudioSequence();

        }, 1000);
      }

      if (event.animationName === "chip-fall") {
        gameChip.style.display = "none";

        setTimeout(() => {
          if (switchOff) {
            switchOff.classList.add("rise-center");
          }
        }, 1000);
      }
    });
  }

  if (switchOff) {
    switchOff.addEventListener("animationend", (event) => {
      if (event.animationName === "switch-rise-center") {
        setTimeout(() => {
          switchOff.src = "img/switch-on.png";

          if (pokemonSoft) {
            pokemonSoft.classList.add("show");
          }

          tiltActive = true;
        }, 1000);
      }
    });
  }

/* =========================== 스위치 3D처럼 보이도록 =========================== */
  document.addEventListener("mousemove", (event) => {
    if (!tiltActive || !switchOff) return;

    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    const normX = x - 0.5;
    const normY = y - 0.5;

    const maxRotateX = 10;
    const maxRotateY = 15;

    const rotateX = -normY * maxRotateX;
    const rotateY = normX * maxRotateY;

    switchOff.style.setProperty("--rx", `${rotateX}deg`);
    switchOff.style.setProperty("--ry", `${rotateY}deg`);

    if (pokemonSoft) {
      pokemonSoft.style.setProperty("--rx", `${rotateX}deg`);
      pokemonSoft.style.setProperty("--ry", `${rotateY}deg`);
    }
  });

  document.addEventListener("mouseleave", () => {
    if (!switchOff) return;

    switchOff.style.setProperty("--rx", `0deg`);
    switchOff.style.setProperty("--ry", `0deg`);

    if (pokemonSoft) {
      pokemonSoft.style.setProperty("--rx", `0deg`);
      pokemonSoft.style.setProperty("--ry", `0deg`);
    }
  });


  if (pokemonSoft) {
    pokemonSoft.addEventListener("click", () => {

      stopIntroAudio();

      if (battleSection) {
        battleSection.classList.add("active");
      }
      if (introWrapper) {
        introWrapper.classList.add("hidden");
      }

      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }


  if (startText) {
    startText.addEventListener("click", () => {
      startChipIntro();
    });
  } else {
    startChipIntro();
  }

/* =========================== click here 텍스트 깜빡깜빡 =========================== */
  setTimeout(() => {
    const clickText = document.querySelector(".intro-start-text");
    if (clickText) {
      clickText.classList.add("appear-complete");
    }
  }, 4200);
});

/* =========================== 스크롤 차단 코드 =========================== */
window.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
window.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
window.addEventListener("keydown", (e) => {
  const blockKeys = ["ArrowUp", "ArrowDown", "Space", "PageDown", "PageUp"];
  if (blockKeys.includes(e.code)) {
    e.preventDefault();
  }
});