const START_DATE = new Date(2023, 0, 15, 0, 0, 0);

const intro = document.getElementById("intro");
const main = document.getElementById("main");
const startButton = document.getElementById("startBtn");
const music = document.getElementById("bgm");
const musicToggle = document.getElementById("musicToggle");
const musicText = document.getElementById("musicText");
const musicIcon = document.getElementById("musicIcon");
const counter = document.getElementById("counter");
const video = document.querySelector("video");

const units = [
  ["years", "Anos"],
  ["months", "Meses"],
  ["days", "Dias"],
  ["hours", "Horas"],
  ["minutes", "Minutos"],
  ["seconds", "Segundos"]
];

function buildCounter() {
  counter.innerHTML = units.map(([id, label]) => `
    <div class="unit">
      <div class="value" id="${id}">0</div>
      <div class="label">${label}</div>
    </div>
  `).join("");
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getElapsed(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }

  if (days < 0) {
    months--;
    const previousMonth = end.getMonth() === 0 ? 11 : end.getMonth() - 1;
    const previousYear = end.getMonth() === 0 ? end.getFullYear() - 1 : end.getFullYear();
    days += daysInMonth(previousYear, previousMonth);
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

function updateCounter() {
  const elapsed = getElapsed(START_DATE, new Date());

  Object.entries(elapsed).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (!element) return;

    if (element.textContent !== String(value)) {
      element.textContent = value;
      element.animate(
        [
          { opacity: 0.45, transform: "translateY(-5px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 280, easing: "ease-out" }
      );
    }
  });
}

function setMusicButtonState() {
  const playing = !music.paused;
  musicText.textContent = playing ? "Música ligada" : "Música pausada";
  musicIcon.textContent = playing ? "♫" : "♪";
  musicToggle.setAttribute("aria-label", playing ? "Pausar música" : "Tocar música");
}

async function startExperience() {
  startButton.disabled = true;

  try {
    music.volume = 0.55;
    await music.play();
  } catch (error) {
    console.warn("O navegador bloqueou o início da música.", error);
  }

  setMusicButtonState();

  intro.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(1.03)" }
    ],
    { duration: 650, easing: "ease-in-out", fill: "forwards" }
  );

  setTimeout(() => {
    intro.style.display = "none";
    main.classList.remove("hidden");

    main.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 850, easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 620);
}

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try { await music.play(); } catch (error) {}
  } else {
    music.pause();
  }
  setMusicButtonState();
});

startButton.addEventListener("click", startExperience);

if (video) {
  video.addEventListener("play", () => {
    if (!music.paused) {
      music.dataset.resumeAfterVideo = "true";
      music.pause();
      setMusicButtonState();
    }
  });

  const resumeMusic = () => {
    if (music.dataset.resumeAfterVideo === "true") {
      music.play().catch(() => {});
      delete music.dataset.resumeAfterVideo;
      setMusicButtonState();
    }
  };

  video.addEventListener("pause", resumeMusic);
  video.addEventListener("ended", resumeMusic);
}

function createFloatingElement() {
  if (main.classList.contains("hidden")) return;

  const element = document.createElement("span");
  element.className = "floating";
  element.textContent = Math.random() > 0.35 ? "❤" : "✦";
  element.style.left = `${Math.random() * 100}vw`;
  element.style.fontSize = `${12 + Math.random() * 18}px`;

  document.body.appendChild(element);

  const animation = element.animate(
    [
      { transform: "translateY(0) rotate(0deg)", opacity: 0 },
      { opacity: 0.55, offset: 0.18 },
      {
        transform: `translate(${(Math.random() - 0.5) * 120}px, -115vh) rotate(${180 + Math.random() * 260}deg)`,
        opacity: 0
      }
    ],
    {
      duration: 7500 + Math.random() * 4500,
      easing: "linear"
    }
  );

  animation.onfinish = () => element.remove();
}

buildCounter();
updateCounter();
setMusicButtonState();

setInterval(updateCounter, 1000);
setInterval(createFloatingElement, 950);
