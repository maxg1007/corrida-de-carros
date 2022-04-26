var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game,allPlayer;
var playerCount, gameState;
var carro1,carro2,carros,carro1_img,carro2_img,pista,fuels,coins,
obstacles,obstacle1Image,obstacle2Image,fuel_img,coin_img,lifes,life_img,
blast;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carro1_img = loadImage("./assets/car1.png")
  carro2_img = loadImage("./assets/car2.png")
  pista = loadImage("./assets/track.jpg")
  fuel_img = loadImage('./assets/fuel.png')
  coin_img = loadImage('./assets/goldCoin.png')
  life_img = loadImage('./assets/life.png')
  obstacle1Image = loadImage('./assets/obstacle1.png')
  obstacle2Image = loadImage('./assets/obstacle2.png')
  blast = loadImage('./assets/blast.png')
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage;
}

function draw() {
  background(bgImg);

  if(playerCount === 2){
    game.update(1)
  }
  if(gameState === 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
