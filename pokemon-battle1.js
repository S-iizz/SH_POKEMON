let lastEnemySkill1 = null;
let repeatCount1 = 0;


document.addEventListener("DOMContentLoaded", () => {
  const battleSection = document.getElementById("pokemon-section");
  if (!battleSection) return;

  // 상대 포켓몬 공격 사운드
  const enemyHitAudio = new Audio("sound/EnemyHit.mp3");
  enemyHitAudio.loop = false;
  enemyHitAudio.volume = 0.8;

  function playEnemyHitSound() {
    enemyHitAudio.currentTime = 0;
    enemyHitAudio.play().catch(() => {
    });
  }

  // 내가 공격당할 때 사운드
  const playerHitAudio = new Audio("sound/PlayerHit.mp3");
  playerHitAudio.loop = false;
  playerHitAudio.volume = 0.8;

  function playPlayerHitSound() {
    playerHitAudio.currentTime = 0;
    playerHitAudio.play().catch(() => { });
  }

  /* =========================== 기술 이미지 =========================== */

  const BOMB_IMG_SRC = "img/hw.png"; // 과제 폭탄
  const SHOCK_IMG_SRC = "img/grade.png"; // C+ 쇼크

  const introPokemon = battleSection.querySelector(".intro-pokemon");
  const enemyStatus = battleSection.querySelector(".enemy-status");
  const playerStatus = battleSection.querySelector(".player-status");
  const enemyNameEl = enemyStatus ? enemyStatus.querySelector(".enemy-name") : null;

  const fightButton = battleSection.querySelector(".fight-button");
  const fightSkills = battleSection.querySelector(".fight-skills");

  const dialog = battleSection.querySelector(".dialog");
  const dialogText = battleSection.querySelector(".dialog-text");

  const enemyHpFill = battleSection.querySelector(".enemy-hp-fill");
  const playerHpFill = battleSection.querySelector(".player-hp-fill");
  const playerBox = battleSection.querySelector(".player-box") || playerStatus;

  const redFlash = document.createElement("div");
  redFlash.className = "red-flash";
  battleSection.appendChild(redFlash);

  const enemySkillLayer = document.createElement("div");
  enemySkillLayer.className = "enemy-skill-layer";
  battleSection.appendChild(enemySkillLayer);

  // hp
  let enemyHp = 100;
  let playerHp = 100;

  let currentTurn = "player";
  let isBusy = false;

  function showDialog(message, callback) {
    if (!dialog || !dialogText) {
      if (typeof callback === "function") callback();
      return;
    }

    dialogText.textContent = message;

    dialog.classList.remove("show");
    void dialog.offsetWidth;
    dialog.classList.add("show");

    function handleAnimationEnd(e) {
      if (e.animationName !== "dialog-slide") return;
      dialog.removeEventListener("animationend", handleAnimationEnd);
      if (typeof callback === "function") {
        callback();
      }
    }

    dialog.addEventListener("animationend", handleAnimationEnd);
  }

  /* =========================== 과제 폭탄 =========================== */

  function playBombEffect() {
    if (!enemySkillLayer) return;

    const count = 10;

    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = BOMB_IMG_SRC;
      img.className = "effect-bomb";

      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 60;

      img.style.left = x + "%";
      img.style.top = y + "%";

      enemySkillLayer.appendChild(img);

      const animation = img.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.3)", opacity: 0 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1.05)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1.1)", opacity: 0 }
        ],
        {
          duration: 2500,
          easing: "ease-out",
        }
      );

      animation.onfinish = () => {
        img.remove();
      };
    }
  }

  /* =========================== C+ 쇼크 =========================== */

  function playShockEffect() {
    if (!enemySkillLayer) return;

    const img = document.createElement("img");
    img.src = SHOCK_IMG_SRC;
    img.className = "effect-shock";

    img.style.left = "50%";
    img.style.top = "50%";
    img.style.transform = "translate(-50%, -50%)";

    enemySkillLayer.appendChild(img);

    const animation = img.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0 },
        { transform: "translate(-50%, -50%) scale(1.1)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(1.1)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(1.0)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(1.0)", opacity: 0 }
      ],
      {
        duration: 2500,
        easing: "ease-out",
      }
    );

    animation.onfinish = () => {
      img.remove();
    };
  }

  /* =========================== hp 감소 =========================== */

  function damageEnemy(amount) {
    enemyHp = Math.max(0, enemyHp - amount);

    if (enemyHpFill) {
      enemyHpFill.style.width = enemyHp + "%";
    }

    if (introPokemon) {
      introPokemon.animate(
        [
          { transform: "translate(-50%, -50%)" },
          { transform: "translate(-48%, -50%)" },
          { transform: "translate(-52%, -50%)" },
          { transform: "translate(-48%, -50%)" },
          { transform: "translate(-52%, -50%)" },
          { transform: "translate(-50%, -50%)" },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
        }
      );
    }

    // 상대 포켓몬이 공격 당할 때 사운드
    if (amount > 0) {
      playEnemyHitSound();
    }
  }

  /* =========================== 내 hp 감소 =========================== */

  function damagePlayer(amount) {
    playerHp = Math.max(0, playerHp - amount);

    if (playerHpFill) {
      playerHpFill.style.width = playerHp + "%";
    }

    if (playerBox) {
      playerBox.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
        }

      );
      // 내가 공격당할 때 사운드
      if (amount > 0) {
        playPlayerHitSound();
      }
    }

    /* =========================== 화면 빨갛게 되는 거 =========================== */
    if (redFlash) {
      redFlash.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
          { opacity: 1 },
          { opacity: 1 },
          { opacity: 0 }
        ],
        {
          duration: 600,
          easing: "ease-out"
        }
      );
    }
  }

  /* =========================== hp 회복 =========================== */

  function healPlayer(amount) {
    playerHp = Math.min(100, playerHp + amount);
    if (playerHpFill) {
      playerHpFill.style.width = playerHp + "%";
    }
  }


  function enemyTurn() {
    if (enemyHp <= 0) {
      isBusy = false;
      return;
    }
    if (playerHp <= 0) {
      if (typeof window.showDefeatEnding === "function") {
        window.showDefeatEnding();
      }
      isBusy = false;
      return;
    }

    currentTurn = "enemy";
    isBusy = true;


    /* =========================== 상대 기술 =========================== */
    let useStrong = Math.random() < 0.5; // 기술 랜덤으로 나오게
    let currentSkill = useStrong ? "strong" : "weak";

    if (lastEnemySkill1 === currentSkill) {
      repeatCount1++;
      if (repeatCount1 >= 2) {
        // 2번 이상 연속으로 안 나오게
        currentSkill = currentSkill === "strong" ? "weak" : "strong";
        useStrong = !useStrong;
        repeatCount1 = 0;
      }
    } else {
      repeatCount1 = 1;
    }
    lastEnemySkill1 = currentSkill;

    let skillName;
    let message;
    let damage;

    if (useStrong) {
      skillName = "과제 폭탄";
      damage = 22;
      message = `데드라이너의 ${skillName}! 효과가 굉장했다! 급소에 맞았다!`;
      playBombEffect();
    } else {
      skillName = "C+쇼크";
      damage = 18;
      message = `데드라이너의 ${skillName}! 효과가 굉장했다!`;
      playShockEffect();
    }

    damagePlayer(damage);

    showDialog(message, () => {
      if (playerHp <= 0) {
        if (typeof window.showDefeatEnding === "function") {
          window.showDefeatEnding();
        }
        isBusy = false;
        return;
      }
      currentTurn = "player";
      isBusy = false;
    });
  }

  window.startBattleIntro = function () {
    battleSection.classList.add("battle-bg");

    if (introPokemon) {
      introPokemon.classList.add("show");
    }

    showDialog("야생의 데드라이너가 나타났다!", () => {
      if (enemyStatus) enemyStatus.classList.add("show");
      if (playerStatus) playerStatus.classList.add("show");
      if (fightButton) fightButton.classList.add("show");

      currentTurn = "player";
      isBusy = false;
    });
  };

  if (fightButton && fightSkills) {
    fightButton.addEventListener("click", () => {
      fightButton.style.display = "none";
      fightSkills.classList.add("show");
      currentTurn = "player";
      isBusy = false;
    });
  }

  /* =========================== 내 기술 =========================== */

  const skillButtons = battleSection.querySelectorAll(".fight-skill");

  const SKILL_DESCRIPTIONS_1 = {
    "멘탈 실드": "효과가 굉장함",
    "리트라이": "효과가 굉장함",
    "디버그 스트라이크": "효과가 별로",
  };

  skillButtons.forEach((btn) => {
    const originalSkillName = btn.textContent.trim();
    btn.dataset.skillName = originalSkillName;

    const desc = SKILL_DESCRIPTIONS_1[originalSkillName] || "";
    if (desc && originalSkillName !== "HP 회복") {
      btn.innerHTML = `
        ${originalSkillName}
        <span class="skill-desc">${desc}</span>
      `;
    }

    btn.addEventListener("click", () => {
      if (isBusy) return;
      if (currentTurn !== "player") return;

      const skillName = btn.dataset.skillName;

      // 기술 사용 횟수 기록
      if (!window.playerSkillUsage) window.playerSkillUsage = {};
      window.playerSkillUsage[skillName] = (window.playerSkillUsage[skillName] || 0) + 1;

      let message = "";
      let damage = 0;
      let heal = 0;

      switch (skillName) {
        case "멘탈 실드":
          message = `나의 ${skillName}! 효과가 굉장했다!`;
          damage = 18;
          break;

        case "리트라이":
          message = `나의 ${skillName}! 효과가 굉장했다!`;
          damage = 18;
          break;

        case "디버그 스트라이크":
          message = `나의 ${skillName}! 효과가 별로인 것 같다...`;
          damage = 8;
          break;

        case "HP 회복":
          message = `체력이 조금 회복되었다!`;
          heal = 25;
          break;

        default:
          message = `나의 ${skillName}!`;
          break;
      }

      isBusy = true;
      currentTurn = "player";

      if (damage > 0) {
        damageEnemy(damage);
      }
      if (heal > 0) {
        healPlayer(heal);
      }

      showDialog(message, () => {
        if (enemyHp <= 0) {
          const enemyName =
            enemyNameEl && enemyNameEl.textContent.trim()
              ? enemyNameEl.textContent.trim()
              : "야생 포켓몬";

          showDialog(`${enemyName}과의 전투에서 승리했다!`, () => {
            if (introPokemon) {
              introPokemon.style.display = "none";
            }
            if (enemyStatus) {
              enemyStatus.style.display = "none";
            }
            if (playerStatus) {
              playerStatus.style.display = "none";
            }
            if (fightSkills) {
              fightSkills.style.display = "none";
            }
            if (fightButton) {
              fightButton.style.display = "none";
            }

            currentTurn = "end";
            isBusy = false;

            /* =========================== 승리하면 2페이즈로 전환 =========================== */
            if (typeof window.startSecondBattle === "function") {
              window.startSecondBattle();
            }
          });

          return;
        }

        const ENEMY_DELAY = 300;
        setTimeout(() => {
          enemyTurn();
        }, ENEMY_DELAY);
      });

    });
  });
});