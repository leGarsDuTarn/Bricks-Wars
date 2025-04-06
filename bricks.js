/* Definition des propriétés des briques.  */
let bricks = []; // Tableau qui contiendra les briques.
let bricksRowCount = 10; // Nbre de briques par ligne.
let bricksColumnCount = 5; // Nbre de briques par colonne.
let bricksWidth = 30; // Largeur d'une brique en pixels.
let bricksHeight = 30; // Hauteur d'une brique en pixel.
let bricksPadding = 10; // Espacement enytre les briques.
let bricksOffsetTop = 30; // Marge de 30 pixel en haut.
let bricksOffsetLeft = 50; // Marge de 50 pixel à gauche (permet de centrer les briques).

/* Création tableau des briques */
function creationBricks() {
  for (let r = 0; r < bricksRowCount; r++) {
    // Itération sur les lignes de briques.
    bricks[r] = []; // Initialisation d'une nouvelle ligne dans le tableau.
    for (let c = 0; c < bricksColumnCount; c++) {
      // Itération sur les colonnes des briques.
      let brickX = r * (bricksWidth + bricksPadding) + bricksOffsetLeft; // Calcul position X de la brique (celle en haut à gauche).
      let brickY = c * (bricksHeight + bricksPadding) + bricksOffsetTop; // Calcul position Y de la brique (celle en haut à gauche).
      bricks[r][c] = { x: brickX, y: brickY, status: 1 }; // Stocke la position et le statut de la brique 1 étant visible.
    }
  }
}

/* Création du dessin des briques */
function drawBricks() {
  for (let r = 0; r < bricksRowCount; r++) {
    // Parcours les lignes de briques.
    for (let c = 0; c < bricksColumnCount; c++) {
      // Parcours les colonnes de briques.
      if (bricks[r][c].status === 1) {
        // Condition qui vérifie si la brique est toujours visible.
        ctx.beginPath(); // Si true, commence un nouveau dessin.
        ctx.rect(bricks[r][c].x, bricks[r][c].y, bricksWidth, bricksHeight); // Dessine un rectangle aux coordonnées de la brique.
        ctx.fillStyle = "#CCFF33"; // Couleur de la  brique.
        ctx.fill(); // Remplissage de la brique avec la couleur ci-dessus.
        ctx.closePath(); // Termine le dessin.
      }
    }
  }
}

function blowBricks() {
  let blow = false;
  for (let row = 0; row < bricks.length; row++) {
    for (let col = 0; col < bricks[row].length; col++) {
      let brick = bricks[row][col];
      if (brick.status === 1) {
        if (
          ballX + ballRadius > brick.x &&
          ballX - ballRadius < brick.x + bricksWidth &&
          ballY + ballRadius > brick.y &&
          ballY - ballRadius < brick.y + bricksHeight
        ) {
          brick.status = 0; // La brique est détruite.
          ballSpeedY *= -1; // La balle rebondit.
          blow = true; // La brique est détruite.
        }
      }
    }
  }
  youWin();
  return blow; // Renvoie true si une brique a été détruite.
}

function resetBricks() {
  // renitialise l'ensemble des bricks si la partie est perdu.
  bricks = [];
  creationBricks();
}

/* Boucle d'animation */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // effacement du canvas pour le redessioné.
  drawBricks(); // Appel de la fonction.
  requestAnimationFrame(draw); //Demande à redessiner la scène à la prochaine frame (60 FPS).
}

creationBricks(); //
