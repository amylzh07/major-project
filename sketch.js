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
let edges = [];
let lFlipper;
let rFlipper;
let reset;

// freefall toggle
let freeFall = true; // does not work for some reason. . .

// set initial game state
let gameState = "start";

// sounds
let pingSound;

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
  lFlipper = new Flipper(midScreen.x - 100, midScreen.y + 300, 100, 20, true);
  rFlipper = new Flipper(midScreen.x + 100, midScreen.y + 300, 100, 20, false);

  let render = Render.create({
    canvas: canvas.elt,
    engine: engine,
    options: { width: width, height: height, showCollisions: true }
  });

  Render.run(render);

  // pinball object
  pinball = new Pinball(midScreen.x, midScreen.y + 200, 10);
  
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

  // reset
  reset = new Reset(midScreen.x, midScreen.y + 380, 400, 40);

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

  // events
  Matter.Events.on(engine, "collisionStart", handleCollisions);
}

function handleCollisions(event) {
  console.log(event);
  for (let pair of event.pairs) {
    let bodyA = pair.bodyA;
    let bodyB = pair.bodyB;

    if (bodyA.label === "ball") {
      if (bodyB.label === "reset") {
        console.log('Pinball hit Reset');
        bodyA.launch();
      }
      else if (bodyB.label === "bumper") {
        console.log('Pinball hit Bumper');
        bodyB.changeColor();
        // bodyB.playSound();
      }
    }
  }
}

function draw() {
  if (gameState === "start") {
    background(0)
    fill("lightblue");
    textSize(75);
    text("Sonic Stunts", midScreen.x - 240, midScreen.y - 100);
    textSize(45);
    text("A Music-Inspired Pinball Game", midScreen.x - 310, midScreen.y + 100)

    keyPressed();
  }
  else if (gameState === "play") {
    background(50);
    Engine.update(engine);

    keyPressed();
    displayEntities();
    handleCollisions();
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

class Reset extends Wall {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    let options = {
      isStatic: true,
      label: "reset",
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    Composite.add(world, this.body);
  }
  show() {
    super.show();
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
      restitution: 0.6,
      label: "ball",
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
    fill(this.color); 
    let pos = this.body.position; 
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    stroke(255);
    strokeWeight(2);
    circle(0, 0, 2 * this.r);
    pop();
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
  launch() {
    this.x = midScreen.x;
    this.y = midScreen.y + 200;
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
      label: "bumper",
    });

    this.color = color(0, 0, 255);

    Composite.add(world, this.body);
  }
  
  show() {
    fill(this.color); 
    let pos = this.body.position; 
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    stroke(255);
    strokeWeight(2);
    circle(0, 0, 2 * this.r);
    pop();
  }

  // changing colors and sounds
  changeColor() {
    this.color(255);
    setTimeout(function() {
      this.color(255);
    }, 100);
  }
  playSound() {
    // add later
  }
}

class Flipper {
  constructor(x, y, w, h, isLeft) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.body = Bodies.rectangle(this.x, this.y, w, h);
    this.velocity = 0.2;

    if (isLeft) {
      this.hinge = { x: x - this.width / 2, y: y };
    }
    else {
      this.hinge = { x: x + this.width / 2, y: y };
    }

    Composite.add(world, this.body);

    let options = {
      bodyA: this.body,
      pointA: isLeft ? { x: - this.width / 2, y: 0} : { x: this.width / 2, y: 0 },
      pointB: { x: this.hinge.x, y: this.hinge.y },
      length: 0,
      stiffness: 1,
    };
    this.constraint = Constraint.create(options);
    Composite.add(world, this.constraint);
  }

  show() {
    // display the flipper
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    fill(100);
    stroke(255);
    strokeWeight(2);
    rect(0, 0, this.width, this.height);
    pop();
  }

  hit(isLeft) {
    if (isLeft) {
      Body.setAngularVelocity(this.body, -this.velocity);
    }
    else {
      Body.setAngularVelocity(this.body, this.velocity);
    }
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === " ") {
    if (gameState === "start") {
      gameState = "play";
    }
    else {
      freeFall = !freeFall; 
    }
  } 
  if (key === "a") {
    lFlipper.hit(true);
  }
  if (key === "d") {
    rFlipper.hit(false);
  }
  if (key === "enter") {
    pinball.launch();
  }
}