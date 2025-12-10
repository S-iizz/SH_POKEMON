let lastEnemySkill2 = null;
let repeatCount2 = 0;

document.addEventListener("DOMContentLoaded", () => {
    const battleSection2 = document.getElementById("pokemon-section-2");
    if (!battleSection2) return;

    // 상대 포켓몬 공격 사운드
    const enemyHitAudio2 = new Audio("sound/EnemyHit.mp3");
    enemyHitAudio2.loop = false;
    enemyHitAudio2.volume = 0.8;

    function playEnemyHitSound2() {
        enemyHitAudio2.currentTime = 0;
        enemyHitAudio2.play().catch(() => { });
    }

    // 내가 공격당할 떄 사운드
    const playerHitAudio2 = new Audio("sound/PlayerHit.mp3");
    playerHitAudio2.loop = false;
    playerHitAudio2.volume = 0.8;

    function playPlayerHitSound2() {
        playerHitAudio2.currentTime = 0;
        playerHitAudio2.play().catch(() => { });
    }

    const BOMB_IMG_SRC = "img/error.png";
    const SHOCK_IMG_SRC = "img/loading.gif";

    const introPokemon = battleSection2.querySelector(".intro-pokemon");
    const enemyStatus = battleSection2.querySelector(".enemy-status");
    const playerStatus = battleSection2.querySelector(".player-status");
    const enemyNameEl = enemyStatus ? enemyStatus.querySelector(".enemy-name") : null;

    const fightButton = battleSection2.querySelector(".fight-button");
    const fightSkills = battleSection2.querySelector(".fight-skills");

    const dialog = battleSection2.querySelector(".dialog");
    const dialogText = battleSection2.querySelector(".dialog-text");

    const enemyHpFill = battleSection2.querySelector(".enemy-hp-fill");
    const playerHpFill = battleSection2.querySelector(".player-hp-fill");
    const playerBox = battleSection2.querySelector(".player-box") || playerStatus;

    const redFlash = document.createElement("div");
    redFlash.className = "red-flash";
    battleSection2.appendChild(redFlash);

    const enemySkillLayer = document.createElement("div");
    enemySkillLayer.className = "enemy-skill-layer";
    battleSection2.appendChild(enemySkillLayer);

    let enemyHp = 100;
    let playerHp = 100;

    let currentTurn = "player";
    let isBusy = false;

    function showDialog2(message, callback) {
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

    function playBombEffect2() {
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

    function playShockEffect2() {
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

    function damageEnemy2(amount) {
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

        // 상대 포켓몬이 맞을 때 사운드
        if (amount > 0) {
            playEnemyHitSound2();
        }
    }

    function damagePlayer2(amount) {
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


            // 내가 공격당할 때사운드
            if (amount > 0) {
                playPlayerHitSound2();
            }
        }

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

    function healPlayer2(amount) {
        playerHp = Math.min(100, playerHp + amount);
        if (playerHpFill) {
            playerHpFill.style.width = playerHp + "%";
        }
    }

    function enemyTurn2() {
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

        let useStrong = Math.random() < 0.5;
        let currentSkill = useStrong ? "strong" : "weak";

        // 같은 기술 2번 이상 연속 방지
        if (lastEnemySkill2 === currentSkill) {
            repeatCount2++;

            if (repeatCount2 >= 2) {
                currentSkill = currentSkill === "strong" ? "weak" : "strong";
                useStrong = !useStrong;
                repeatCount2 = 0;
            }
        } else {
            repeatCount2 = 1;
        }

        lastEnemySkill2 = currentSkill;

        let skillName;
        let message;
        let damage;

        if (useStrong) {
            skillName = "에러 익스플로전";
            damage = 22;
            message = `버그스크린의 ${skillName}! 효과가 굉장했다! 급소에 맞았다!`;
            playBombEffect2();
        } else {
            skillName = "무한 렌더링";
            damage = 18;
            message = `버그스크린의 ${skillName}! 효과가 굉장했다!`;
            playShockEffect2();
        }

        damagePlayer2(damage);

        showDialog2(message, () => {
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

    if (fightButton && fightSkills) {
        fightButton.addEventListener("click", () => {
            fightButton.style.display = "none";
            fightSkills.classList.add("show");
            currentTurn = "player";
            isBusy = false;
        });
    }

    const skillButtons = battleSection2.querySelectorAll(".fight-skill");

    const SKILL_DESCRIPTIONS_2 = {
        "디버그 스트라이크": "효과가 굉장함",
        "컷편집 스톰": "효과가 굉장함",
        "리트라이": "효과가 별로",
    };

    skillButtons.forEach((btn) => {

        const originalSkillName = btn.textContent.trim();
        btn.dataset.skillName = originalSkillName;

        const desc = SKILL_DESCRIPTIONS_2[originalSkillName];
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
                case "디버그 스트라이크":
                    message = `나의 ${skillName}! 효과가 굉장했다!`;
                    damage = 16;
                    break;

                case "컷편집 스톰":
                    message = `나의 ${skillName}! 효과가 굉장했다!`;
                    damage = 16;
                    break;

                case "리트라이":
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

            if (damage > 0) damageEnemy2(damage);
            if (heal > 0) healPlayer2(heal);

            showDialog2(message, () => {

                if (enemyHp <= 0) {
                    const enemyName =
                        enemyNameEl && enemyNameEl.textContent.trim()
                            ? enemyNameEl.textContent.trim()
                            : "야생 포켓몬";

                    showDialog2(`${enemyName}과의 전투에서 승리했다!`, () => {
                        if (introPokemon) introPokemon.style.display = "none";
                        if (enemyStatus) enemyStatus.style.display = "none";
                        if (playerStatus) playerStatus.style.display = "none";
                        if (fightSkills) fightSkills.style.display = "none";
                        if (fightButton) fightButton.style.display = "none";

                        currentTurn = "end";
                        isBusy = false;

                        if (typeof window.showVictoryEnding === "function") {
                            window.showVictoryEnding();
                        }
                    });

                    return;
                }
                setTimeout(() => {
                    enemyTurn2();
                }, 300);
            });
        });
    });

    window.startSecondBattle = function () {
        const battleSection1 = document.getElementById("pokemon-section");

        const overlay = document.createElement("div");
        overlay.className = "phase2-overlay";
        document.body.appendChild(overlay);

        void overlay.offsetWidth;

        overlay.style.opacity = "1";

        const handleFadeInEnd = (e) => {
            if (e.propertyName !== "opacity") return;
            overlay.removeEventListener("transitionend", handleFadeInEnd);

            if (battleSection1) {
                battleSection1.classList.remove("active");
                battleSection1.style.display = "none";
            }

            battleSection2.style.display = "flex";
            battleSection2.classList.add("active");
            battleSection2.classList.add("battle-bg");

            if (introPokemon) {
                introPokemon.classList.remove("show");
            }

            const HOLD_BLACK = 800;

            setTimeout(() => {
                overlay.addEventListener("transitionend", handleFadeOutEnd);
                overlay.style.opacity = "0";
            }, HOLD_BLACK);
        };

        const handleFadeOutEnd = (e) => {
            if (e.propertyName !== "opacity") return;
            overlay.removeEventListener("transitionend", handleFadeOutEnd);
            overlay.remove();

            if (introPokemon) {
                introPokemon.classList.remove("show");
                void introPokemon.offsetWidth;
                introPokemon.classList.add("show");
            }

            showDialog2("야생의 버그스크린이 나타났다!", () => {
                if (enemyStatus) enemyStatus.classList.add("show");
                if (playerStatus) playerStatus.classList.add("show");
                if (fightButton) fightButton.classList.add("show");

                currentTurn = "player";
                isBusy = false;
            });
        };
        overlay.addEventListener("transitionend", handleFadeInEnd);
    };
});
