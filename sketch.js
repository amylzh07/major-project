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

  pinball = new Pinball(midScreen.x, midScreen.y);

  position = createVector(midScreen.x, midScreen.y - 2 * beginning);
  velocity = createVector(1, 3.3);
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

// apply forces to full entity?
// then you can make obstacles static and whatever
// build base entity then extend to pinballs
// referring to nature of code tutorial

class Entity {
  constructor(x, y) {
    this.position = position.add(velocity); // this line is not working
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
    let d = this.position.dist(theObject.position);

    // if (d < ??) { find what distance is needed for collision detection
    // center of object to center of other object ??
    // rectangle to circle collision is very weird
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
  changeColor() {
    
  }
  playSound() {

  }
}

class Flipper extends Entity {
  // WASD or arrow control to control flipper movement
  constructor() {
    super(x, y);
  }
  controlMovement() { // i think this has to be keyPressed
    if (key === 68) {

    }
  }
}