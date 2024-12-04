// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// variables to store vertexes and certain positions
let midScreen;
let beginning;
let end;

// variables to store position and velocity
let position;
let velocity;

// create objects and obstacles
let pinball;
let obstacles = [];

// collision boolean
let isColliding = false;

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

  position = createVector(midScreen.x, midScreen.y - 2 * beginning);
  velocity = createVector(0, 5);

  pinball = new Pinball(midScreen.x, midScreen.y);
}

function draw() {
  if (gameState === "start") {
    background(0);
  }
  else if (gameState === "play") {
    background(50);
    spawnMachine();
    displayEntities();
  }
  else if (gameState === "end") {
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
  pinball.update();
}

class Entity {
  constructor() {
    this.position = position.add(velocity);
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    if (position.x > midScreen.x + beginning || position.x < midScreen.x - beginning) {
      velocity.x = velocity.x * -1;
    }
    if (position.y > midScreen.y + 1.5 * end || position.y < midScreen.y - 2 * beginning) {
      velocity.y = velocity.y * -1;
    }
  }

  collide(theObject)  {
    // let d = this.position.dist(theObject.position);

    // if (d < ??) { find what distance is needed for collision detection
    // center of object to center of other object
    // rectangle to circle collision
    //  
    // }

    // apply collisions using boundary box

    // scalar: mass
    // vectors: position, velocity, and acceleration

    // pos' = pos + vel
    // vel' = vel + accel
    // f = m * a

    // collision detection
    // when are two bodies collidling

    // collision resolution
    // what happens after two bodies collide 

  }
}

class Pinball extends Entity {
  constructor() {
    super();
    this.x = position.x;
    this.y = position.y;
    this.r = 10;
  }
  // gravity and movement
  update() {
    super.update();
  }
  // different displays
  display() {
    fill(100, 100, 255);
    circle(this.x, this.y, this.r);
  }
}

class Obstacle extends Entity {
  // changing colors and sounds
  changeColor() {
    
  }
  playSound() {

  }
}

class Flipper extends Entity {
  constructor() {
    super(x, y);
  }
  display() {
    // look like a flipper
  }
  controlUp() {
    // flip upwards
  }
  controlDown() {
    // flip downwards
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === 65) {
    Flipper.controlDown();
  }
  if (key === 68) {
    Flipper.controlUp();
  }
}