// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

let midScreen;
let beginning;
let end;
let pinball;
let obstacles = [];

// let gameState = "start";
let gameState =  "play";

function setup() {
  createCanvas(windowWidth, windowHeight);

  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };

  beginning = Math.min(midScreen.x, midScreen.y) / 3;
  end = Math.min(midScreen.x, midScreen.y) / 2;

  pinball = new Pinball(midScreen.x, midScreen.y);

}

function draw() {
  if (gameState === "start") {
    background(0);
  }
  else if (gameState === "play") {
    background(50);
    displayEntities();
    spawnMachine();
  }
  else if (gameState === "end") {
    // goodbye
  }
}

function spawnMachine() {
  beginShape();
  fill(255);

  vertex(midScreen.x - beginning, midScreen.y - 2 * beginning);
  vertex(midScreen.x + beginning, midScreen.y - 2 * beginning);
  vertex(midScreen.x + end, midScreen.y + 1.5 * end);
  vertex(midScreen.x - end, midScreen.y + 1.5 * end);
  
  endShape();
}

function displayEntities() {
  pinball.display();
}


class Entity {
  // needs collisions

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Pinball extends Entity {
  constructor(x, y) {
    super(x, y);
    this.r = 10;
  }
  // gravity and movement

  // different displays
  display() {
    fill(0, 0, 255);
    circle(this.x, this.y, this.r);
  }
}

class Obstacle extends Entity {
  // changing colors and sounds

}

class Flipper extends Entity {
  // WASD or arrow control to control flipper movement

}