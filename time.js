/* initialisation des variables pour le gestion du chrono */
let startTime; // Stocke l'heure de début du chronomètre
let timerInterval; // Contiendra l'identifiant de l'intervalle (setInterval)
let elapsedTime = 0; // Temps écoulé en secondes
let bestTime = localStorage.getItem("bestTime"); // Récupère le meilleur temps stocké
bestTime = bestTime ? Number(bestTime) : null; // Convertit en nombre ou met null si absent

function startTimer() {
  startTime = Date.now(); // Enregistre l'heure actuelle
  timerInterval = setInterval(() => {
    // Permet de lancer un compteur.
    elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calcule le temps écoulé en secondes
    document.getElementById("chrono").textContent = `Temps : ${elapsedTime}s`; // Affiche le temps dans l'élément #chrono
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval); // Arrête le compteur
  document.getElementById("best-time").textContent = // Affiche le meilleur temps ou "--" si pas encore défini
    bestTime !== null
      ? `🏆 Meilleur temps : ${bestTime}s`
      : `🏆 Meilleur temps : --`;
}
let recordMessage = document.getElementById("new-record-message");
recordMessage.style.display = "none"
function registerBestTime() {
  if (gameWin) {
    // Si la partie est gagnée
    const storedTime = localStorage.getItem("bestTime"); // Récupère le meilleur temps actuel
    if (!storedTime || elapsedTime < storedTime) {
      // Si  le temps actuel est meilleur que le temps enregistrer
      bestTime = elapsedTime; // Met à jour la variable bestTime
      localStorage.setItem("bestTime", bestTime); // Sauvegarde le nouveau meilleur temps
      recordMessage.style.display = "inline"
    } else {
      recordMessage.style.display = "none"
    }
  }
}

function resetTimeDisplay() {
  elapsedTime = 0; // Réinitialise le temps écoulé
  document.getElementById("chrono").textContent = `Temps : 0s`; // Affiche 0s dans #chrono
  document.getElementById("best-time").textContent = bestTime // Affiche le meilleur temps ou "--"
    ? `🏆 Meilleur temps : ${bestTime}s`
    : `🏆 Meilleur temps : --`;
}

function startGame() {
  resetTimeDisplay(); // Réinitialise l'affichage du temps
  startTimer(); // Lance le chronomètre
}

// Option pour réinitialiser le meilleur temps au démarrage
const RESET_BEST_TIME_ON_START = false;

if (RESET_BEST_TIME_ON_START) {
  localStorage.removeItem("bestTime"); // Supprime le meilleur temps sauvegardé
}
