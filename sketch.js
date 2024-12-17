// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// update: using matter.js now

// aliases
const { Engine, Bodies, Composite, Body, Vector, Render } = Matter;

// engine as a global variable
let engine;
let world;

// variables to store vertexes and certain positions
let midScreen;
let beginning;
let end;

// create objects and obstacles
let pinball;
let obstacles = [];
let lFlipper;
let rFlipper;

// collision boolean
let isColliding = false;

// freefall toggle
let freeFall = true; // does not work for some reason. . .

// let gameState = "start";
let gameState =  "play";

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  angleMode(RADIANS);

  // make the engine
  engine = Engine.create();
  world = engine.world;

  let render = Render.create({
    canvas: canvas.elt,
    engine,
    options: { width: width, height: height }
  });

  Render.run(render);

  // positions
  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };

  beginning = Math.min(midScreen.x, midScreen.y) / 3;
  end = Math.min(midScreen.x, midScreen.y) / 2;

  // pinball object
  pinball = new Pinball(midScreen.x, midScreen.y, 10);
  
  for (let i = 0; i < 5; i++) {
    let theObstacle = new Obstacle();
    obstacles.push(theObstacle);
  }

  // lFlipper = new leftFlipper();
  // rFlipper = new rightFlipper();
}

function draw() {
  if (gameState === "start") {
    background(0);
  }
  else if (gameState === "play") {
    background(50);
    Engine.update(engine);
    // keyPressed();
    spawnMachine();
    displayEntities();
  }
  else if (gameState === "end") {
  }   
}

function spawnMachine() {
  fill(255);
  let vertices = [];

  vertices[0] = Vector.create(midScreen.x - beginning, midScreen.y - 2 * beginning);
  vertices[1] = Vector.create(midScreen.x + beginning, midScreen.y - 2 * beginning);
  vertices[2] = Vector.create(midScreen.x + end, midScreen.y + 1.5 * end);
  vertices[3] = Vector.create(midScreen.x - end, midScreen.y + 1.5 * end);

  let machine = Bodies.fromVertices(midScreen.x, midScreen.y, vertices);

  Composite.add(world, machine);
}

function displayEntities() {
  pinball.update();
  pinball.show();

  for (let obstacle of obstacles) {
    obstacle.show();
  }
  
  // lFlipper.display();
  // rFlipper.display();
  // rFlipper.controlUp();
}

class Pinball {
  constructor(x, y, r) {
    // radius
    this.r = r;
    let options = {
      friction: 0.3,
      restitution: 0.6
    };

    // create body
    this.body = Bodies.circle(x, y, this.r, options);

    Composite.add(world, this.body);

    // position, velocity, acceleration vectors
    this.position = createVector(midScreen.x, midScreen.y - 2 * beginning);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 20;
 

    // forces
    this.mass = 10;
  
    // graphics
    this.color = color(random(255), random(255), random(255));
  }

  // show object
  show() {
    let pos = this.body.position;

    fill(this.color);
    circle(this.position.x, this.position.y + this.r, this.r * 2 );
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

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    let options = { isStatic: true };
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    
    Composite.add(world, this.body);
    
    this.color = 150;
    this.size = 60;
  }
  
  // Drawing the box
  show() {
    rectMode(CENTER);
    fill(127);
    stroke(0);
    strokeWeight(2);    
    rect(this.x, this.y, this.w, this.h);
  }

  // this.position = createVector(random(midScreen.x - 0.5 * beginning, midScreen.x + 0.5 * beginning), random(midScreen.y - 1.5 * beginning, midScreen.y + end));

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

// class rightFlipper {
//   constructor() {
//     super();
//     this.position = createVector(0, 0);
//     this.width = 80;
//     this.height = 20;
//   }
//   display() {
//     fill(0, 10, 200);
//     push();
//     translate(midScreen.x + 0.125 * beginning, midScreen.y + 1.125 * end);
//     rect(this.position.x, this.position.y, this.width, this.height);
//     pop();
//   }
//   controlUp() {
//     push();
//     translate(midScreen.x + 0.125 * beginning + this.width, midScreen.y + 1.125 * end);
//     rotate(QUARTER_PI); // not working
//     pop();
//   }
//   controlDown() {
//     // flip downwards
//   }
// }

// class leftFlipper {
//   constructor() {
//     super();
//     this.position = createVector(0, 0);
//     this.width = 80;
//     this.height = 20;
//   }
//   display() {
//     fill(0, 10, 200);
//     push();
//     translate(midScreen.x - 0.125 * beginning - this.width, midScreen.y + 1.125 * end);
//     rect(this.position.x, this.position.y, this.width, this.height);
//     pop();
//   }
//   controlUp() {
//     push();
//     rotate(-QUARTER_PI);
//     pop();
//   }
//   controlDown() {
//     // flip downwards
//   }
// }

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