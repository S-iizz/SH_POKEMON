document.addEventListener("DOMContentLoaded", () => {

  window.stopBattleBgm = function () {
    if (window.battleBgm && typeof window.battleBgm.pause === "function") {
      window.battleBgm.pause();
      window.battleBgm.currentTime = 0;
    }
  };

  // 사운드
  const defeatEndingAudio = new Audio("sound/DefeatEnding.mp3");   // 실패 엔딩
  defeatEndingAudio.loop = false;
  defeatEndingAudio.volume = 0.8;

  const victoryEndingAudio = new Audio("sound/VictoryEnding.wav"); // 성공 엔딩
  victoryEndingAudio.loop = false;
  victoryEndingAudio.volume = 0.8;

  function playEndingAudio(audio) {
    if (!audio || typeof audio.play !== "function") return;
    audio.currentTime = 0;
    audio.play().catch(() => {
    });
  }

  const restartFlag = sessionStorage.getItem("restartToBattle");

  if (restartFlag === "1") {
    sessionStorage.removeItem("restartToBattle");

    const introWrapper = document.querySelector(".intro-wrapper");
    if (introWrapper) {
      introWrapper.classList.add("hidden");
    }

    const battleSection = document.getElementById("pokemon-section");
    if (battleSection) {
      battleSection.style.display = "flex";
      battleSection.classList.add("active");

      const top = battleSection.offsetTop || 0;
      window.scrollTo({ top, behavior: "auto" });
    }
  }

/* =========================== 패배 엔딩 =========================== */
  window.__endingShown = false;

  window.showDefeatEnding = function () {
    if (window.__endingShown) return;
    window.__endingShown = true;

    if (typeof window.stopBattleBgm === "function") {
      window.stopBattleBgm();
    }
    // 실패 엔딩 사운드
    playEndingAudio(defeatEndingAudio);

    const overlay = document.createElement("div");
    overlay.className = "ending-overlay ending-defeat";

    const dialog = document.createElement("div");
    dialog.className = "ending-dialog";

    const title = document.createElement("div");
    title.className = "ending-title";
    title.textContent = "나는 눈앞이 캄캄해졌다...";

    const subtitle = document.createElement("div");
    subtitle.className = "ending-subtitle";
    subtitle.textContent = "다시 도전하시겠습니까?";

    const choices = document.createElement("div");
    choices.className = "ending-choices";

    const yes = document.createElement("div");
    yes.className = "ending-choice ending-yes";
    yes.textContent = "예";

    const no = document.createElement("div");
    no.className = "ending-choice ending-no";
    no.textContent = "아니오";

    choices.appendChild(yes);
    choices.appendChild(no);

    dialog.appendChild(title);
    dialog.appendChild(subtitle);
    dialog.appendChild(choices);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";

    void overlay.offsetWidth;

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    });

/* =========================== 예 아니오 =========================== */

    // 예
    yes.addEventListener("click", () => {
      // 전투부터 다시 시작한다는 플래그 저장
      sessionStorage.setItem("restartToBattle", "1");
      window.location.reload();
    });

    // 아니오
    no.addEventListener("click", () => {
      // 혹시 남아 있을지 모르는 플래그는 제거
      sessionStorage.removeItem("restartToBattle");
      window.location.reload();
    });
  };


/* =========================== 승리 엔딩 =========================== */

  window.showVictoryEnding = function () {
    if (window.__endingShown) return;
    window.__endingShown = true;

    if (typeof window.stopBattleBgm === "function") {
      window.stopBattleBgm();
    }

    // 승리 엔딩 사운드 재생
    playEndingAudio(victoryEndingAudio);

    const overlay = document.createElement("div");
    overlay.className = "ending-overlay ending-victory";

    const layout = document.createElement("div");
    layout.className = "victory-layout";

    // 인트로 고양이 SVG
    const left = document.createElement("div");
    left.className = "victory-left";

    const introCatSvg = document.querySelector(".intro-cat-wrapper .intro-cat-svg");

    if (introCatSvg) {
      const catClone = introCatSvg.cloneNode(true);
      catClone.style.animationDelay = "0s";
      left.appendChild(catClone);
    } else {
      const img = document.createElement("img");
      img.className = "victory-portrait";
      img.src = "img/victory-ending.png";
      img.alt = "승리 엔딩 이미지";
      left.appendChild(img);
    }

    // 능력치 게이지
    const right = document.createElement("div");

    right.className = "victory-right";

    function createGauge(labelText) {
      const box = document.createElement("div");
      box.className = "victory-gauge";

      const label = document.createElement("div");
      label.className = "victory-gauge-label";
      label.textContent = labelText;

      const bar = document.createElement("div");
      bar.className = "victory-gauge-bar";

      const fill = document.createElement("div");
      fill.className = "victory-gauge-fill";

      bar.appendChild(fill);

      const value = document.createElement("div");
      value.className = "victory-gauge-value";
      value.textContent = "0%";

      box.appendChild(label);
      box.appendChild(bar);
      box.appendChild(value);

      return { box, fill, value };
    }

    const mentalGauge = createGauge("정신력");
    const cutGauge = createGauge("컷편집 기술");
    const debugGauge = createGauge("디버깅 기술");

    right.appendChild(mentalGauge.box);
    right.appendChild(cutGauge.box);
    right.appendChild(debugGauge.box);

    const closeBtn = document.createElement("div");
    closeBtn.className = "victory-close";
    closeBtn.textContent = "타이틀로 돌아가기";

    right.appendChild(closeBtn);

    layout.appendChild(left);
    layout.appendChild(right);
    overlay.appendChild(layout);

    // 대사창
    const victoryDialog = document.createElement("div");
    victoryDialog.className = "dialog victory-dialog";

    const victoryDialogInner = document.createElement("div");
    victoryDialogInner.className = "dialog-inner";

    const victoryDialogText = document.createElement("div");
    victoryDialogText.className = "dialog-text";

    victoryDialogInner.appendChild(victoryDialogText);
    victoryDialog.appendChild(victoryDialogInner);
    overlay.appendChild(victoryDialog);

    document.body.appendChild(overlay);

    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    void overlay.offsetWidth;
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    });

    function showEndingDialog(message, callback) {
      if (!victoryDialog || !victoryDialogText) {
        if (typeof callback === "function") callback();
        return;
      }

      victoryDialogText.textContent = message;

      victoryDialog.classList.remove("show");
      void victoryDialog.offsetWidth;
      victoryDialog.classList.add("show");

      function handleAnimationEnd(e) {
        if (
          e.animationName !== "dialog-slide" &&
          e.animationName !== "dialog-slide-victory"
        ) return;
        victoryDialog.removeEventListener("animationend", handleAnimationEnd);
        if (typeof callback === "function") {
          callback();
        }
      }

      victoryDialog.addEventListener("animationend", handleAnimationEnd);
    }

/* =========================== 승리 엔딩 게이지 바 =========================== */
    const BASE_MENTAL = 50;
    const BASE_CUT = 55;
    const BASE_DEBUG = 40;

    function setBaseGauge(gauge, base) {
      const fill = gauge.fill;
      const value = gauge.value;

      const prevTransition = fill.style.transition;

      fill.style.transition = "none";
      fill.style.width = base + "%";
      value.textContent = base + "%";

      void fill.offsetWidth;

      fill.style.transition = prevTransition || "";
    }

    setBaseGauge(mentalGauge, BASE_MENTAL);
    setBaseGauge(cutGauge, BASE_CUT);
    setBaseGauge(debugGauge, BASE_DEBUG);


/* =========================== 기술 횟수 =========================== */
    const usage = window.playerSkillUsage || {};

    const mentalShieldCount = usage["멘탈 실드"] || 0;
    const retryCount = usage["리트라이"] || 0;
    const cutstormCount = usage["컷편집 스톰"] || 0;
    const debugCount = usage["디버그 스트라이크"] || 0;

    function clampPercent(v) {
      return Math.max(0, Math.min(100, v));
    }

    const events = [];

    // 정신력: 멘탈 실드 + 리트라이 합산
    const totalMental = mentalShieldCount + retryCount;

    if (totalMental === 0) {
      const usedText = `멘탈 실드를 0번, 리트라이를 0번`;
      const mentalTarget = BASE_MENTAL;
      const endingText = "정신력이 전혀 오르지 않았다...";

      events.push({
        gauge: mentalGauge,
        from: BASE_MENTAL,
        to: mentalTarget,
        text: `${usedText} 사용했다! ${endingText}`,
      });
    } else {
      const usedText = `멘탈 실드를 ${mentalShieldCount}번, 리트라이를 ${retryCount}번`;

      // 1~5번: 조금 올랐다, 6번 이상: 엄청나게 올랐다
      const isHuge = totalMental >= 6;
      const mentalTarget = clampPercent(
        BASE_MENTAL + totalMental * 5
      );
      const endingText = isHuge
        ? "정신력이 엄청나게 올랐다!"
        : "정신력이 조금 올랐다.";

      events.push({
        gauge: mentalGauge,
        from: BASE_MENTAL,
        to: mentalTarget,
        text: `${usedText} 사용했다! ${endingText}`,
      });
    }


    // 컷편집 스톰
    if (cutstormCount === 0) {
      events.push({
        gauge: cutGauge,
        from: BASE_CUT,
        to: BASE_CUT,
        text: "컷편집 스톰을 한 번도 사용하지 않았다! 컷편집 기술이 전혀 오르지 않았다...", // 0회 사용 시
      });
    } else {
      const isHuge = cutstormCount >= 6; // 6회 이상 사용했으면 엄청나게 올랐다
      const cutTarget = clampPercent(
        BASE_CUT + cutstormCount * 5
      );

      const endingText = isHuge
        ? "컷편집 기술이 엄청나게 올랐다!"
        : "컷편집 기술이 조금 올랐다.";

      events.push({
        gauge: cutGauge,
        from: BASE_CUT,
        to: cutTarget,
        text: `컷편집 스톰을 ${cutstormCount}번 사용했다! ${endingText}`,
      });
    }

    // 디버그 스트라이크
    if (debugCount === 0) {
      events.push({
        gauge: debugGauge,
        from: BASE_DEBUG,
        to: BASE_DEBUG,
        text: "디버그 스트라이크를 한 번도 사용하지 않았다! 디버깅 기술이 전혀 오르지 않았다...", // 0회 사용 시
      });
    } else {
      const isHuge = debugCount >= 6;
      const debugTarget = clampPercent(
        BASE_DEBUG + debugCount * 5
      );

      const endingText = isHuge
        ? "디버깅 기술이 엄청나게 올랐다!"
        : "디버깅 기술이 조금 올랐다.";

      events.push({
        gauge: debugGauge,
        from: BASE_DEBUG,
        to: debugTarget,
        text: `디버그 스트라이크를 ${debugCount}번 사용했다! ${endingText}`,
      });
    }


    let index = 0;

    const playNext = () => {
      if (index >= events.length) {
        showEndingDialog("오늘의 전투는 여기까지!", () => { });
        return;
      }

      const ev = events[index];
      const target = ev.to;

      showEndingDialog(ev.text, () => {
        ev.gauge.fill.style.width = target + "%";
        ev.gauge.value.textContent = Math.round(target) + "%";

        setTimeout(() => {
          index++;
          playNext();
        }, 1000);
      });
    };

    setTimeout(playNext, 2000);


    // 타이틀로 돌아가기
    closeBtn.addEventListener("click", () => {
      sessionStorage.removeItem("restartToBattle");
      window.location.reload();
    });
  };
});
