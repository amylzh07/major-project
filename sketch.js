// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// note: collision between line and circle
// consider redoing machine layout
// use unit circle to determine length of line and collision between line and circle
// make the free fall work and fix the bounding

// variables to store vertexes and certain positions
let midScreen;
let beginning;
let end;

// create objects and obstacles
let pinball;
let obstacles = [];
let lFlipper;
let rFlipper;

// force of gravity
let gravity;

// collision boolean
let isColliding = false;

// freefall toggle
let freeFall = true; // does not work for some reason. . .

// let gameState = "start";
let gameState =  "play";

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(RADIANS);

  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };

  beginning = Math.min(midScreen.x, midScreen.y) / 3;
  end = Math.min(midScreen.x, midScreen.y) / 2;

  gravity = createVector(0, 1.5);

  pinball = new Pinball();
  
  for (let i = 0; i < 5; i++) {
    let theObstacle = new Obstacle();
    obstacles.push(theObstacle);
  }

  lFlipper = new leftFlipper();
  rFlipper = new rightFlipper();
}

function draw() {
  if (gameState === "start") {
    background(0);
  }
  else if (gameState === "play") {
    background(50);
    // keyPressed();
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

  // for (let obstacle of obstacles) {
  //   obstacle.display();
  // }
  
  lFlipper.display();
  rFlipper.display();
  rFlipper.controlUp();
}

class Pinball {
  constructor() {
    // position, velocity, acceleration vectors
    this.position = createVector(midScreen.x, midScreen.y - 2 * beginning);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 20;

    // forces
    this.mass = 10;
  
    // graphics
    this.color = color(random(255), random(255), random(255));

    // radius
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

    // apply gravity
    if (freeFall) {
      this.applyForce(gravity);
    }
  }
  applyForce(force) {
    let appliedForce = p5.Vector.div(force, this.mass);
    this.acceleration.add(appliedForce);
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

class Entity {
  constructor() {

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

class Obstacle extends Entity {
  constructor() {
    super();
    this.position = createVector(random(midScreen.x - 0.5 * beginning, midScreen.x + 0.5 * beginning), random(midScreen.y - 1.5 * beginning, midScreen.y + end));
    this.color = 150;
    this.size = 60;
  }
  display() {
    fill(this.color);
    rect(this.position.x, this.position.y, this.size, this.size *  0.25);
  } 
  // changing colors and sounds
  changeColor() {
    // upon collision
  }
  playSound() {
  }
}

class rightFlipper extends Entity {
  constructor() {
    super();
    this.position = createVector(0, 0);
    this.width = 80;
    this.height = 20;
  }
  display() {
    fill(0, 10, 200);
    push();
    translate(midScreen.x + 0.125 * beginning, midScreen.y + 1.125 * end);
    rect(this.position.x, this.position.y, this.width, this.height);
    pop();
  }
  controlUp() {
    push();
    translate(midScreen.x + 0.125 * beginning + this.width, midScreen.y + 1.125 * end);
    rotate(QUARTER_PI); // not working
    pop();
  }
  controlDown() {
    // flip downwards
  }
}

class leftFlipper extends Entity {
  constructor() {
    super();
    this.position = createVector(0, 0);
    this.width = 80;
    this.height = 20;
  }
  display() {
    fill(0, 10, 200);
    push();
    translate(midScreen.x - 0.125 * beginning - this.width, midScreen.y + 1.125 * end);
    rect(this.position.x, this.position.y, this.width, this.height);
    pop();
  }
  controlUp() {
    push();
    rotate(-QUARTER_PI);
    pop();
  }
  controlDown() {
    // flip downwards
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === "") {
    freeFall = !freeFall; 
  } 
  if (key === 65) {
    rFlipper.controlDown();
  }
  if (key === 68) {
    rFlipper.controlUp();
  }
}