// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

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
let boundaries = [];
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
    let theBoundary = new Boundary(midScreen.x, midScreen.y + 250, 100, 50);
    boundaries.push(theBoundary);
  }
}

function draw() {
  if (gameState === "start") {
    background(0);
  }
  else if (gameState === "play") {
    background(50);
    Engine.update(engine);

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
  for (let boundary of boundaries) {
    boundary.show();
  }
  pinball.show();

  if (pinball.checkEdge()) {
    pinball.removeBody();
  }
}

class Pinball {
  constructor(x, y, r) {
    // radius
    this.r = r;
    // let options = {
    //   restitution: 0.6,
    //   friction: 0.3
    // };

    // create body
    this.body = Bodies.circle(x, y, this.r, { restitution: 1 } );

    // velocity, acceleration vectors
    this.velocity = Vector.create(random(-3, 3), 0);

    // graphics
    this.color = color(random(255), random(255), random(255));
    
    Body.setAngularVelocity(this.body, this.velocity);
    
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
}

class Boundary {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, { isStatic: true });

    this.color = 150;

    Composite.add(world, this.body);
  }
  
  // draw the box
  show() {
    rectMode(CENTER);
    fill(this.color);
    stroke(0);
    strokeWeight(2);    
    rect(this.x, this.y, this.w, this.h);
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