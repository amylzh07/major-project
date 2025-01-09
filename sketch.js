// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// aliases
const { Engine, Bodies, Composite, Body, Vector, Render, Constraint } = Matter;

// engine as a global variable
let engine;
let testFlipper;
let world;

// variables to store vertexes and certain positions
let midScreen;
let beginning;
let end;

// create objects and obstacles
let pinball;
let bumpers = [];
let walls = [];
let lFlipper;
let rFlipper;

// freefall toggle
let freeFall = true; // does not work for some reason. . .

// let gameState = "start";
let gameState =  "play";

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  // make the engine
  engine = Engine.create();
  world = engine.world;

  // positions
  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };

  beginning = Math.min(midScreen.x, midScreen.y) / 3;
  end = Math.min(midScreen.x, midScreen.y) / 2;

  // test flipper
  testFlipper = new Flipper(midScreen.x - beginning, height - 100, 150, 10);

  let render = Render.create({
    canvas: canvas.elt,
    engine: engine,
    options: { width: width, height: height, showCollisions: true }
  });

  Render.run(render);

  // pinball object
  pinball = new Pinball(midScreen.x, midScreen.y - 100, 10);
  
  // bumpers
  for (let i = 0; i < 1; i++) {
    let theBumper = new Bumper(midScreen.x, midScreen.y);
    bumpers.push(theBumper);
  }

  // walls
  let wallTop = new Wall(midScreen.x, midScreen.y - 280, 200, 40);
  walls.push(wallTop);
  let wallBottom = new Wall(midScreen.x, midScreen.y + 280, 200, 40);
  walls.push(wallBottom);
  let wallLeft = new Wall(midScreen.x - 100, midScreen.y, 40, 600);
  walls.push(wallLeft);
  let wallRight = new Wall(midScreen.x + 100, midScreen.y, 40, 600);
  walls.push(wallRight);

}

function draw() {
  if (gameState === "start") {
    // background(0);
  }
  else if (gameState === "play") {
    // background(50);
    Engine.update(engine);

    keyPressed();
    // spawnMachine();
    displayEntities();
  }
  else if (gameState === "end") {
  }   
}

function displayEntities() {
  // show bumpers
  for (let bumper of bumpers) {
    bumper.show();
  }
  // show walls
  for (let wall of walls) {
    wall.show();
  }
  // show pinball
  pinball.show();

  // show flipper
  testFlipper.show();

  if (pinball.checkEdge()) {
    pinball.removeBody();
  }
}

class Wall {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  
    let options = {
      isStatic: true
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    Composite.add(world, this.body);
  }
  show() {
    let pos = this.body.position;
    rectMode(CENTER);
    rect(pos.x, pos.y, this.w, this.h);
  }
}

class Pinball {
  constructor(x, y, r) {
    // radius
    this.r = r;

    // options
    let options = {
      restitution: 0.6
    };

    // create body
    this.body = Bodies.circle(x, y, this.r, options);

    // velocity, acceleration vectors
    this.velocity = Vector.create(0, random(-3, 3));

    // graphics
    this.color = color(random(255), random(255), random(255));
    
    Body.setVelocity(this.body, this.velocity);
    
    Composite.add(world, this.body);
  }
  // show object
  show() {
    let pos = this.body.position;
    fill(this.color);
    circle(pos.x, pos.y + this.r, this.r * 2 );
  }
  // check boundaries
  checkEdge() {
    let pos = this.body.position;
    return pos.y > height + 2 * this.r;
  }
  // remove if out of bounds
  removeBody() {
    Composite.remove(world, this.body);
  }
  // launch function
  launch() {
    // Body.setVelocity(this.body, this.velocity);
  }
}

class Bumper {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 25;

    this.body = Bodies.circle(this.x, this.y, this.r, { 
      isStatic: true,
      restitution: 1.5,
    });

    this.color = color(0, 0, 255);

    Composite.add(world, this.body);
  }
  
  // draw the box
  show() {
    fill(this.color); 
    let pos = this.body.position;  
    circle(pos.x, pos.y, 2 * this.r);
  }

  // changing colors and sounds
  changeColor() {
    // use collision events
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

class Flipper {
  constructor(x, y, w, h) {
    this.width = w;
    this.height = h;
    this.body = Bodies.rectangle(x, y, w, h);
    this.hinge = { 
      x: x, 
      y: y + this.width / 2};
    Composite.add(world, this.body);

    let options = {
      bodyA: this.body,
      pointB: { x: this.hinge.x, y: this.hinge.y},
      // bodyB: hinge,
      length: 0,
      stiffness: 1,
    };
    this.constraint = Matter.Constraint.create(options);
    Composite.add(world, this.constraint);
  }

  show() {
    fill(150);
    stroke(0);
    strokeWeight(2);
    let pos = this.body.position;
    rect(pos.x, pos.y, this.width, this.height);
  }

  hit() {
    Body.setAngularVelocity(this.body, -1);
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === "") {
    freeFall = !freeFall; 
  } 
  if (key === "a") {
    testFlipper.hit();
  }
  if (key === 68) {
    rFlipper.controlUp();
  }
  if (key === "enter") {
    pinball.launch();
  }
}