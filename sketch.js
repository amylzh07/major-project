// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

let midScreen;

function setup() {
  createCanvas(windowWidth, windowHeight);

  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };
}

function draw() {
  background(50);

  spawnMachine();
}

function spawnMachine() {
  beginShape();
  fill(255);

  vertex(midScreen.x - 50, midScreen.y - 80);
  vertex(midScreen.x + 50, midScreen.y - 80);
  vertex(midScreen.x - 100, midScreen.y - 150);
  vertex(midScreen.x + 100, midScreen.y + 150);
  endShape(CLOSE);
}