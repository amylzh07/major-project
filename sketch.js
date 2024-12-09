// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// variables to store vertexes and certain positions
let midScreen;
let beginning;
let end;

// create objects and obstacles
let pinball;
let obstacles = [];

// force of gravity
let gravity;

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

  gravity = createVector(0, 1.5);

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
  pinball.update();
  pinball.display();
}

class Entity {
  constructor() {
    // position, velocity, acceleration vectors
    this.position = createVector(midScreen.x, midScreen.y - 2 * beginning);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0); // bug: ball keeps bouncing sideways e.g. to the left always
    this.maxSpeed = 20;

    // forces
    this.mass = 10;

    // graphics
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // check bounds
    this.checkEdges();

    // apply gravity
    this.applyForce(gravity);
  }

  applyForce(force) {
    let appliedForce = p5.Vector.div(force, this.mass);
    this.acceleration.add(appliedForce);
  }

  checkEdges() {
    if (this.position.x > midScreen.x + beginning || this.position.x < midScreen.x - beginning) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.position.y > midScreen.y + 1.5 * end || this.position.y < midScreen.y - 2 * beginning) {
      this.velocity.y = this.velocity.y * -1;
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
    this.r = 10;
  }
  // gravity and movement
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // check bounds
    this.checkEdges();

    // apply forces
    this.applyForce(gravity);
  }

  applyForce() {
    super.applyForce(gravity);
  }

  checkEdges() { // x-position bounding gets a bit weird...fix needed
    if (this.position.x > midScreen.x + beginning || this.position.x < midScreen.x - beginning) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.position.y > midScreen.y + 1.5 * end - 2 * this.r || this.position.y < midScreen.y - 2 * beginning) {
      this.velocity.y = this.velocity.y * -1;
    }
  }

  // different displays
  display() {
    fill(this.color);
    circle(this.position.x, this.position.y + this.r, this.r * 2 );
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