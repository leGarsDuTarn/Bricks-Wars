/* initialisation des variables pour le gestion du chrono */
let startTime;
let timerInterval;
let elapsedTime = 0;
let bestTime = localStorage.getItem("bestTime");
bestTime = bestTime ? Number(bestTime) : null;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("chrono").textContent = `Temps : ${elapsedTime}s`;
  }, 1000);
}
function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById("best-time").textContent =
    bestTime !== null
      ? `🏆 Meilleur temps : ${bestTime}s`
      : `🏆 Meilleur temps : --`;
}
function registerBestTime() {
  if (gameWin) {
    const storedTime = localStorage.getItem("bestTime");
    if (!storedTime || elapsedTime < storedTime) {
      bestTime = elapsedTime;
      localStorage.setItem("bestTime", bestTime);
    }
  }
}

function resetTimeDisplay() {
  elapsedTime = 0;
  document.getElementById("chrono").textContent = `Temps : 0s`;
  document.getElementById("best-time").textContent = bestTime
    ? `🏆 Meilleur temps : ${bestTime}s`
    : `🏆 Meilleur temps : --`;
}

function startGame() {
  resetTimeDisplay();
  startTimer();
}

// gestion pour reinitialiser le meilleur temps
const RESET_BEST_TIME_ON_START = false;

if (RESET_BEST_TIME_ON_START) {
  localStorage.removeItem("bestTime");
}
