// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// to-do:
// how can i tell flipper left from flipper right?
// finish drawing machine
// matter.js events

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
let edges = [];
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

  // flippers
  lFlipper = new Flipper(midScreen.x - 200, midScreen.y + 300, 100, 20);
  rFlipper = new Flipper(midScreen.x + 200, midScreen.y + 300, 100, 20);


  let render = Render.create({
    canvas: canvas.elt,
    engine: engine,
    options: { width: width, height: height, showCollisions: true }
  });

  Render.run(render);

  // pinball object
  pinball = new Pinball(midScreen.x, midScreen.y - 100, 10);
  
  // bumpers top row
  for (let i = -1 ; i < 2; i++) {
    let theBumper = new Bumper(midScreen.x + i * 100, midScreen.y - 185);
    bumpers.push(theBumper);
  }

  // bumpers bottom row
  for (let i = 0 ; i < 1; i++) {
    let theBumper = new Bumper(midScreen.x + i * 80, midScreen.y + 20);
    bumpers.push(theBumper);
  }

  // walls
  let wallTop = new Wall(midScreen.x, midScreen.y - 380, 400, 40);
  walls.push(wallTop);
  let wallBottom = new Wall(midScreen.x, midScreen.y + 380, 400, 40);
  walls.push(wallBottom);
  let wallLeft = new Wall(midScreen.x - 200, midScreen.y, 40, 800);
  walls.push(wallLeft);
  let wallRight = new Wall(midScreen.x + 200, midScreen.y, 40, 800);
  walls.push(wallRight);

  // triangle edges on bottom FIX
  let bottomLeft = [
    { x: midScreen.x - 200, y: midScreen.y + 280 },
    { x: midScreen.x - 200, y: midScreen.y + 380},
    { x: midScreen.x - 100, y: midScreen.y + 380 },
  ];
  // let bottomRight = [
  //   { x:  },
  //   {},
  //   {},
  // ];

  // create edges
  let bottomLeftEdge = new Edge(bottomLeft);
  // let bottomRightEdge = new Edge(bottomRight)

  edges.push(bottomLeftEdge);
}

function draw() {
  if (gameState === "start") {
    // background(0);
  }
  else if (gameState === "play") {
    background(50);
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

  for (let edge of edges) {
    edge.show();
  }
  // show pinball
  pinball.show();

  // show flipper
  lFlipper.show();
  rFlipper.show();

  if (pinball.checkEdge()) {
    pinball.removeBody();
  }
}
// rectangle box to enclose machine
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

// triangle corner to make game play more fun
class Edge {
  constructor(vertices) {
    let options = {
      isStatic: true,
    };
    this.body = Bodies.fromVertices(0, 0, vertices, options);

    Composite.add(world, this.body);
  }

  show() {
    fill(150);
    stroke(255);
    beginShape();
    for (let v of this.body.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
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
    circle(pos.x, pos.y, this.r * 2 );
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

    // events
    
    // Events.on(engine, "collisionStart", 

    // );
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

class Flipper {
  constructor(x, y, w, h, ) {
    this.width = w;
    this.height = h;
    this.body = Bodies.rectangle(x, y, w, h);
    this.hinge = { 
      x: x - this.width / 2, 
      y: y };
    Composite.add(world, this.body);

    let options = {
      bodyA: this.body,
      pointB: { x: this.hinge.x, y: this.hinge.y},
      length: 0,
      stiffness: 1,
    };
    this.constraint = Constraint.create(options);
    Composite.add(world, this.constraint);
  }

  show() {
    // Display the flipper
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    fill(200);
    stroke(0);
    rect(0, 0, this.width, this.height);
    pop();
  }

  hit() {
    Body.setAngularVelocity(this.body, -0.2);
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === "") {
    freeFall = !freeFall; 
  } 
  if (key === "a") {
    lFlipper.hit();
  }
  if (key === "d") {
    rFlipper.hit();
  }
  if (key === "enter") {
    pinball.launch();
  }
}