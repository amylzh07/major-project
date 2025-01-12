// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

// to-do sunday:
// i want my flipper to actually work and not be semi-broken.
// make the machine positions relative and design the board properly.

// to-do monday:
// let's make this machine look pretty!
// get the jams going e.g. cue the muuusic 

// aliases
const { Engine, Bodies, Composite, Body, Vector, Render, Constraint } = Matter;

// engine as a global variable
let engine;
let testFlipper;
let world;

// variables to store vertexes and certain positions
let midScreen;
let machineWidth;
let machineHeight;

// create objects and obstacles
let pinball;
let bumpers = [];
let walls = [];
let edges = [];
let lFlipper;
let rFlipper;
let reset;

// up booleans for flippers
let isUp = true;

// set initial game state
let gameState = "start";

// scoring
let score = 0;
let highScore = 0;

// sounds
let pingSound;


function preload() {
  pingSound = loadSound("/assets/ping.mp3");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  // get local highscore
  if (getItem("highest")) {
    highScore = getItem("highest");
  }

  // make the engine
  engine = Engine.create();
  world = engine.world;

  // positions
  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };

  machineWidth = windowWidth / 4;
  machineHeight = windowHeight * 4/5;

  // render canvas
  let render = Render.create({
    canvas: canvas.elt,
    engine: engine,
    options: { width: width, height: height, showCollisions: true }
  });

  Render.run(render);

  // pinball object
  pinball = new Pinball(midScreen.x, midScreen.y + 200, 10);
  
  // bumpers top row
  for (let i = - 4; i < 3; i += 3) {
    let theBumper = new Bumper(midScreen.x + i * machineWidth / 12, midScreen.y - machineHeight / 4);
    bumpers.push(theBumper);
  }

  // bumpers bottom row
  for (let i = - 3; i < 2; i+= 3) {
    let theBumper = new Bumper(midScreen.x + i * machineWidth / 12, midScreen.y - machineHeight / 12);
    bumpers.push(theBumper);
  }

  // triangle edges on bottom
  let bottomLeft = [
    { x: midScreen.x - machineWidth / 2, y: midScreen.y + machineHeight / 2},
    { x: midScreen.x - machineWidth / 2, y: midScreen.y + machineHeight / 3},
    { x: midScreen.x - machineWidth / 6, y: midScreen.y + machineHeight / 2},
  ];

  let bottomRight = [
    { x: midScreen.x + machineWidth / 3, y: midScreen.y + machineHeight / 3},
    { x: midScreen.x + machineWidth / 3, y: midScreen.y + machineHeight / 2},
    { x: midScreen.x, y: midScreen.y + machineHeight / 2},
  ];

  let topLeft = [
    { x: midScreen.x - machineWidth / 2, y: midScreen.y - machineHeight / 2},
    { x: midScreen.x - machineWidth / 2, y: midScreen.y - machineHeight / 4},
    { x: midScreen.x, y: midScreen.y - machineHeight / 2},
  ];

  let topRight = [
    { x: midScreen.x + machineWidth / 2, y: midScreen.y - machineHeight / 2},
    { x: midScreen.x + machineWidth / 2, y: midScreen.y - machineHeight / 4},
    { x: midScreen.x, y: midScreen.y - machineHeight / 2},
  ];

  // create edges
  let bottomLeftEdge = new Edge(bottomLeft);
  let bottomRightEdge = new Edge(bottomRight);
  let topLeftEdge = new Edge(topLeft);
  let topRightEdge = new Edge(topRight);

  edges.push(bottomLeftEdge);
  edges.push(bottomRightEdge);
  edges.push(topLeftEdge);
  edges.push(topRightEdge);

  // launch alley wall
  let wallAlley = new Alley(midScreen.x + machineWidth / 3, midScreen.y + machineHeight / 6 + 10, 20, machineHeight * 2/3);
  walls.push(wallAlley);

  // walls
  let wallTop = new Wall(midScreen.x, midScreen.y - machineHeight / 2, machineWidth, 20);
  walls.push(wallTop);
  let wallBottom = new Wall(midScreen.x, midScreen.y + machineHeight / 2, machineWidth, 20);
  walls.push(wallBottom);
  let wallLeft = new Wall(midScreen.x - machineWidth / 2, midScreen.y, 20, machineHeight + 20);
  walls.push(wallLeft);
  let wallRight = new Wall(midScreen.x + machineWidth / 2, midScreen.y, 20, machineHeight + 20);
  walls.push(wallRight);

  // reset
  reset = new Reset(midScreen.x - machineWidth / 12, midScreen.y + machineHeight / 2 - 10, machineWidth / 6, 20);

  // flippers
  lFlipper = new Flipper(midScreen.x - machineWidth / 3, midScreen.y + machineHeight / 4, machineWidth / 6, 15, true);
  rFlipper = new Flipper(midScreen.x + machineWidth / 6, midScreen.y + machineHeight / 4, machineWidth / 6, 15, false);  

  // events
  Matter.Events.on(engine, "collisionStart", function(event) {
    for (let pair of event.pairs) {
      let bodyA = pair.bodyA;
      let bodyB = pair.bodyB;

      if (bodyA.label === "pinball") {
        if (bodyB.label === "reset") {
          let ball = bodyA.get;
          ball.reset();
        }
        else if (bodyB.label === "bumper") {
          let bumper = bodyB.get;
          bumper.changeColor();
          bumper.playSound();
          score += 10;
          if (score > highScore) {
            highScore = score;
            storeItem("highest", highScore);
          }
        }
      }
    }
  });
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
    displayScores();
    displayEntities();
  }
  else if (gameState === "pause") {
    screenPaused();
  }
  else if (gameState === "end") {
  }   
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

  reset.show();

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

function displayScores() {
  fill("black");
  textSize(50);
  text(score, 50, height/2);

  fill("black");
  textSize(50);
  text(highScore, width - 50, height/2);
}

function screenPaused() {
  circle(midScreen.x, midScreen.y, 200);
}

// rectangle box to enclose machine
class Wall {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color(150);

    let options = {
      isStatic: true
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    Composite.add(world, this.body);
  }
  show() {
    let pos = this.body.position;
    noStroke();

    fill(this.color); 
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

    // return object when called
    this.body.get = this;

    Composite.add(world, this.body);
  }
  show() {
    this.color = color(255);
    super.show();
  }
}

class Alley extends Wall {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    let options = {
      isStatic: true,
      chamfer: { radius: 10 },
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    // return object when called
    this.body.get = this;

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

    this.centroid = {
      x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
      y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
    };

    this.body = Bodies.fromVertices(this.centroid.x, this.centroid.y, vertices, options);

    Composite.add(world, this.body);
  }

  show() {
    fill(150);
    noStroke();
    beginShape();
    for (let v of this.body.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}

class Pinball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    // options
    let options = {
      restitution: 0.6,
      label: "pinball",
    };

    // create body
    this.body = Bodies.circle(this.x, this.y, this.r, options);

    // velocity, acceleration vectors
    this.velocity = Vector.create(0, random(-3, 3));

    // graphics
    this.color = color(random(255), random(255), random(255));

    // return object when called
    this.body.get = this;
    
    Body.setVelocity(this.body, this.velocity);

    Composite.add(world, this.body);
  }
  // show object
  show() {
    fill(this.color); 
    let pos = this.body.position; 
    let angle = this.body.angle;

    push();
    noStroke();
    translate(pos.x, pos.y);
    rotate(angle);
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
  reset() {
    Body.setPosition(this.body, { x: midScreen.x + machineWidth / 3 + 30, y: midScreen.y + machineHeight / 2 - 20});
    Body.setVelocity(this.body, { x: 0, y: 0 });
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

    // return object when called
    this.body.get = this;

    Composite.add(world, this.body);
  }
  
  show() {
    fill(this.color); 
    let pos = this.body.position; 
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    noStroke();
    circle(0, 0, 2 * this.r);
    pop();
  }

  // changing colors and sounds
  changeColor() {
    let self = this;
    self.color = color(255, 0, 0)
    setTimeout(function() {
      self.color = color(0, 0, 255);
    }, 100);
  }

  playSound() {
    pingSound.play();
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
    noStroke();
    rect(0, 0, this.width, this.height);
    pop();
  }

  hit(isLeft) {
    if (isUp) {
      if (isLeft) {
        Body.setAngularVelocity(this.body, -this.velocity);
        // setTimeout(function() {
        //   console.log("Removing velocity");
        //   Body.setAngularVelocity(this.body, 0);
        // }, 100);
      }
      else {
        Body.setAngularVelocity(this.body, this.velocity);
        // setTimeout(function() {
        //   console.log("Removing velocity");
        //   Body.setAngularVelocity(this.body, 0);
        // }, 100);
      }
    }
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === " ") {
    if (gameState === "start") {
      gameState = "play";
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

// just to release flippers
function keyReleased() {
  if (key === "a") {
    lFlipper.hit(false); // flipper moves down when key is released
  }
  if (key === "d") {
    rFlipper.hit(false); // flipper moves down when key is released
  }
}