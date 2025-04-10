/* Mise en place du contexte du canvas */
const canvas = document.getElementById("game-setup-canvas");
const ctx = canvas.getContext("2d");

/* Variables concernant les briques */
let bricksRevealed = true;

/* Création de la barre (paddle) */
let paddleWidth = 120; // Unité = pixel
let paddleHeight = 20; // Unité = pixel
let paddleX = (canvas.width - paddleWidth) / 2; // Centre le paddle en X
let paddleY = canvas.height - paddleHeight - 60; // Place le paddle à 30px du bas.
let paddleSpeed = 8;

/* Dessin du paddle */
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#000000"; // Couleur du paddle
  ctx.fill();
  ctx.closePath();
}
drawPaddle();

/* Création des propriété de la balle */
let ballRadius = 15; /* Rayon de balle établie à 15px donc 30 pixel de diamètre */
let ballX =
  paddleX +
  paddleWidth /
    2; /* création de la position initiale de la balle en X - elle doit être centré */
let ballY =
  paddleY -
  ballRadius; /* création de la position initiale de la balle en Y - elle doit être centré */
let ballSpeedX = 2; /* Vitesse de 2 pixels à chaque frame sur l'axe X. */
let ballSpeedY = 2; /* Vitesse de 2 pixels à chaque frame sur l'axe Y. */
const maxSpeed = 7; /* Vitesse maximal de la balle */
let ballLunched = false; // La balle est elle lancé ?

/* Création du dessin de la balle */
function drawBall() {
  /* Création d'une couleur radial (de l'intérieur vers l'extérieur) pour embellir la balle */
  let gradientColorBall = ctx.createRadialGradient(
    ballX,
    ballY,
    0,
    ballX,
    ballY,
    ballRadius
  );
  gradientColorBall.addColorStop(0, "#70e000");
  gradientColorBall.addColorStop(1, "#03071e");

  // Dessin de la balle avec le dégradé de couleur
  ctx.beginPath(); // Nouveau dessin
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); // Dessin du cercle Math.PI * 2 = 360°
  ctx.fillStyle = gradientColorBall; // Definition de la couleur ici le gradient
  ctx.fill(); // Remplissage avec la couleur de la balle
  ctx.closePath(); // Fin du dessin
}
drawBall();

function updateBallPosition() {
  ballX +=
    ballSpeedX; /* Mise à jour des coordonnées de la balle sur l'axe X à chaque frame en lui ajoutant la vitesse pour qu'elle puisse continuer à se déplacer sinon elle restera fixe après son déplacement */
  ballY += ballSpeedY; /* Même chose mais pour l'axe Y */

  /* Prise en compte des collisions avec les bords gauche et droits */
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX; // inverse la direction de la balle sur l'axe X.
  }

  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY; // inverse la direction de la balle sur l'axe Y.
  }

  /* Collision avec le bas du canvas (game over) */
  if (ballY + ballRadius > canvas.height) {
    gamePause = true; // Le jeux s'arrête
    ballLunched = false; // Gere l'effet de style la balle. Elle reste collée au paddle malgré le deplacement de celui-ci.
    newGameBtn.style.display = "inline"; // Visible
    pauseBtn.style.display = "none"; // Caché
    playBtn.style.display = "none"; // Caché
    restartBtn.style.display = "none"; // Cache
    resetBricks();
    gameOverBenji();
  }

  /*  Prise en compte des collisions avec le haut du paddle */
  if (
    ballY + ballRadius >= paddleY &&
    ballY + ballRadius <= paddleY + paddleHeight &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    ballSpeedY = -ballSpeedY; // La balle peut rebondir sur le paddle.
    ballSpeedY = -2;
  }

  // Limite la vitesse sur l'axe X tout en conservant la direction
  ballSpeedX =
    Math.sign(ballSpeedX) * // Récupère le signe de la vitesse actuelle (1 pour positif, -1 pour négatif)
    Math.min(Math.abs(ballSpeedX), maxSpeed); // Multiplie ce signe par la plus petite valeur entre la vitesse actuelle (en valeur absolue) et la vitesse maximale autorisée

  // Limite la vitesse sur l'axe Y tout en conservant la direction
  ballSpeedY =
    Math.sign(ballSpeedY) * // Récupère le signe de la vitesse actuelle (1 pour positif, -1 pour négatif)
    Math.min(Math.abs(ballSpeedY), maxSpeed); // Multiplie ce signe par la plus petite valeur entre la vitesse actuelle (en valeur absolue) et la vitesse maximale autorisée
}

/* Mise en place des variables pour les boutons */
let gamePause = false; // Le jeu est-il en pause ?
let gameStart = false; // Le jeu a t-il commencé ?
let newGame = false; // Est-ce une nouvelle partie ?
let gameOver = false; // La partie est-elle perdue ?
let gameWin = false; // La partie est-elle gagnee ?
let restartGame = false; // Le joueur veut-il rejouer la partie ?

/* Récupére l'ID des boutons */
const pauseBtn = document.getElementById("pause-game-btn");
const playBtn = document.getElementById("play-game-btn");
const newGameBtn = document.getElementById("new-game-btn");
const restartBtn = document.getElementById("restart-game-btn");
const winMessage = document.getElementById("win-message");

/* Affichage des boutons avant la première partie jouée*/
playBtn.style.display = "inline"; // Visible
newGameBtn.style.display = "none"; // Caché
pauseBtn.style.display = "none"; // Caché
restartBtn.style.display = "none"; // Cache

/* Gestion du bouton Play */
playBtn.addEventListener("click", function () {
  gamePause = false;
  playBtn.style.display = "none"; // Le bouton Play est caché.
  pauseBtn.style.display = "inline"; // Le bouton Pause est visible.
  animate();
});

/* Gestion du bouton Pause */
pauseBtn.addEventListener("click", function () {
  gamePause = true;
  pauseBtn.style.display = "none"; // Le bouton Pause est caché car le jeu est déjà en pause.
  playBtn.style.display = "inline"; // Le bouton "Play" est affiché.
});

/*  Gestion du bouton Restart */
restartBtn.addEventListener("click", function () {
  restartGame();
});

/* Gestion du bouton Nouvelle Partie */
newGameBtn.addEventListener("click", function () {
  // Réinitialisation de l'état du jeu.
  gameStart = true;
  gameOver = false;
  gamePause = false;
  gameWin = false;
  restartGame = false;

  // Réinitialisation de la position de la balle et de sa vitesse.
  ballX = paddleX + paddleWidth / 2;
  ballY = paddleY - ballRadius;
  ballSpeedX = 1;
  ballSpeedY = -1;

  //Réinitialisation de la position du paddle.
  paddleX = (canvas.width - paddleWidth) / 2;

  pauseBtn.style.display = "inline"; // Le bouton Pause est caché.
  playBtn.style.display = "none"; // Le bouton Play est caché.
  newGameBtn.style.display = "none"; // Le bouton Nouvelle Partie est caché.

  // Réinitialisation du message Game Over lors d'une nouvelle Partie
  gameOverMessage.style.display = "none"; // Cacher le message.
  recordMessage.style.display = "none"; // Cache le message si nouveau record
  // Relance du jeu
  startGame();
  animate();
});

/* Gestion du Win */
winMessage.style.display = "none";
function youWin() {
  let allBricksDestroyed = true;
  for (let row = 0; row < bricks.length; row++) {
    for (let col = 0; col < bricks[row].length; col++) {
      if (bricks[row][col].status === 1) {
        allBricksDestroyed = false;
        break;
      }
    }
    if (!allBricksDestroyed) break;
  }
  if (allBricksDestroyed) {
    winMessage.style.display = "inline";
    restartBtn.style.display = "inline";
    pauseBtn.style.display = "none";
    playBtn.style.display = "none";
    gameOverMessage.style.display = "none";
    gamePause = true;
    gameWin = true;
    animate();
    stopTimer();
    registerBestTime();
  }
}

//Cheat code pour supprimer les bricks imediatement
/* document.addEventListener("keydown", (event) => {
  if (event.key === "w") {
    // Appuie sur "W" pour gagner directement
    bricks.forEach((row) => row.forEach((brick) => (brick.status = 0)));
    youWin();
  }
})*/

/* Gestion du Game Over */
let gameOverMessage = document.getElementById("game-over-message");
function gameOverBenji() {
  if (ballY + ballRadius > canvas.height) {
    // La balle vient de toucher le bas du canvas.
    gameOver = true;
    gamePause = true;

    stopTimer();

    // Affichage des briques.
    bricksRevealed = true;

    // Réinitialisation de la position du paddle avant celle de la balle
    paddleX = (canvas.width - paddleWidth) / 2;

    //Réinitialisation de la position de la balle.
    ballX = paddleX + paddleWidth / 2;
    ballY = paddleY - ballRadius;

    // Affichage des boutons.
    newGameBtn.style.display = "inline"; // Affichage Nouvelle Partie.
    pauseBtn.style.display = "none"; // Bouton Pause est caché.
    winMessage.style.display = "none";

    // Affichage du message Game Over.
    gameOverMessage.style.display = "block";
  }
}

/* Initialisation des fléches du clavier pour le mouvement du paddle */
let rightPressed = false;
let leftPressed = false;
/* Initialisation des touches du clavier pour Play et Pause */
let spacePressed = false;
let enterPressed = false;

document.addEventListener("keydown", keyDownHandler, false); // Initialisation de l'événement d'écoute lorsque une touche est pressé.
document.addEventListener("keyup", keyUpHandler, false); // Initialisation de l'événement d'écoute lorsque une touche est relaché.

function keyDownHandler(event) {
  event.preventDefault(); // Empêche le défilement de la page lorsqu'une touche directionnelle est appuyée
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = true;
  }

  // Relance du jeu quand il est en pause avec la touche Espace.
  let pauseMessage = document.getElementById("pause-message");
  if (event.code === "Space" && !gameOver) {
    if (gamePause) {
      gamePause = false;
      ballLunched = true; // Permet de lancer la balle à chaque nouvelle partie.
      bricksRevealed = true;
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline";
      pauseMessage.style.display = "none";
      animate();
    }
    // Relance du jeu quand c'est une nouvelle partie avec la touche Space.
    if (!gameStart) {
      gameStart = true;
      spacePressed = true;
      ballLunched = true; // Permet de lancer la balle pour pas qu'elle reste collé au paddle.
      bricksRevealed = true;
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline";
      recordMessage.style.display = "none";
      animate();
      startGame(); // Demare le chrono
    }
  }
  // Met le jeu en pause qu'on appuie sur la touche P.
  if (event.code === "KeyP" && !gameOver) {
    gamePause = true;
    bricksRevealed = true;
    playBtn.style.display = "inline";
    pauseBtn.style.display = "none";
    pauseMessage.style.display = "inline";
    animate(); //Permet de garder visible les briques et la balle et le paddle durant la pause du jeu.
  }
  // Gestion de la relance du jeu en New Game.
  if (event.code === "Enter" && gameOver) {
    gameOver = false;
    newGame = true;
    ballLunched = false; // Colle la balle au paddle.
    playBtn.style.display = "inline"; // Visible
    pauseBtn.style.display = "none"; // Caché
    newGameBtn.style.display = "none"; // Caché
    gameOverMessage.style.display = "none"; // Cache le message Game Over.
    winMessage.style.display = "none";
    recordMessage.style.display = "none"; // cache le message new record
    startGame(); // Demare le chrono
  }
  if (event.code === "Enter" && gameWin) {
    gameWin = false;
    newGame = false;
    ballLunched = false; // Colle la balle au paddle.
    playBtn.style.display = "inline"; // Visible
    pauseBtn.style.display = "none"; // Caché
    newGameBtn.style.display = "none"; // Caché
    gameOverMessage.style.display = "none"; // Cache le message Game Over.
    winMessage.style.display = "none"; // Cache
    restartBtn.style.display = "none"; // cache
    recordMessage.style.display = "none"; // cache le message new record
    startGame();
    resetBricks();
  }
}

function keyUpHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = false;
  }
}

/* Mise à jour de la position de la barre */
function updatePaddlePosition() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    //paddleX > 0 = évite que le paddle dépasse du canvas.
    paddleX -= paddleSpeed;
  }
}

/* Permet de faire bouger le paddle et d'afficher les briques avant que la partie commence. */
function animatePaddle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePaddlePosition();
  drawPaddle();
  drawBall();
  drawBricks();
  requestAnimationFrame(animatePaddle);
  if (!ballLunched) {
    ballX = paddleX + paddleWidth / 2;
    ballY = paddleY - ballRadius;
  }
}

function animate() {
  if (gamePause) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface les lignes dessinées par la balle à chaque déplacement
  updateBallPosition(); // Appel de la fonctionde mise à jour de la position de la ball.
  updatePaddlePosition(); // Appel de la fonction de mise à jour de la position du paddle.
  blowBricks();
  drawBricks();
  drawPaddle(); // Redessine le paddle.
  drawBall(); // Redessine la Balle.
  gameOverBenji();
  requestAnimationFrame(animate);
}
/* Permet de faire bouger le paddle à chaque rafraichissement du navigateur */
window.onload = function () {
  animatePaddle();
};
