document.addEventListener("DOMContentLoaded", () => {
  const playerForm = document.getElementById("playerForm");
  const gameCanvas = document.getElementById("game-setup-canvas");
  const playerNameInput = document.getElementById("playerNameInput");

  function startGame() {
    let playerName = playerNameInput.value.trim();
    if (playerName !== "") {
      localStorage.setItem("playerName", playerName);
      playerForm.style.display = "none";
      gameCanvas.style.display = "block";
    } else {
      alert("Veuillez entrez un nom !");
    }
  }
  document
    .getElementById("start-game-btn")
    .addEventListener("click", startGame);
});
