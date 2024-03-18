var canvas;
var backgroundImage;
var database, gameState;
var form, player, playerCount;
var allPlayers 
var player1Img, player1, player2Img, player2, boulderImg, boulder, fireballImg, fireball, player1Hurt, player2Hurt
var wall
var climber1, climber2;
var climbers = [];
var bouldersGroup, fireballsGroup
var boulder, fireball;
var fireball = []

function preload() {
  backgroundImage = loadImage("./assets/background.gif");
  player1Img = loadAnimation("assets/player1Climb/Player1-1.png","assets/player1Climb/Player1-2.png","assets/player1Climb/Player1-3.png","assets/player1Climb/Player1-4.png","assets/player1Climb/Player1-5.png","assets/player1Climb/Player1-6.png")
  player2Img = loadAnimation("assets/Player2Climb/Player2-1.png","assets/Player2Climb/Player2-2.png","assets/Player2Climb/Player2-3.png","assets/Player2Climb/Player2-4.png","assets/Player2Climb/Player2-5.png","assets/Player2Climb/Player2-6.png")
  wall = loadImage("BackgroundForGame.png")
  boulderImg = loadAnimation("assets/Boulder/Boulder1.png","assets/Boulder/Boulder2.png")
  fireballImg = loadAnimation("assets/Fireball/fireball0.png","assets/Fireball/fireball1.png","assets/Fireball/fireball2.png","assets/Fireball/fireball3.png","assets/Fireball/fireball4.png","assets/Fireball/fireball5.png","assets/Fireball/fireball6.png","assets/Fireball/fireball7.png","assets/Fireball/fireball8.png",)
  player1Hurt = loadAnimation("assets/player1Hurt/Player1Hurt1.png", "assets/player1Hurt/player1Hurt2.png")
  player2Hurt = loadAnimation("assets/Player2Hurt/player2Hurt2.png")
}

function setup() {
  canvas = createCanvas(500, 600);
  database = firebase.database();
  game = new Game();
  game.start();
  game.getState();
}

function draw() {
  
  background(0);
  image(wall,0,-3070,500,4000)
  image(backgroundImage, 0,0,500,650)

  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
   
    game.end();
  }
}