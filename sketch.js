// Ping-ball
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
let launchpad;

// reset boolean
let wasReset = false;

// flipper up
let isUp = false;

// game events
let instructionsShown = false;

// ui icons for buttons
let homeIcon;
let instructionsIcon;

// buttons
let homeButton;
let instructionsButton;

// set initial game state
let gameState = "start";

// scoring
let score = 0;
let highScore = 0;

// sounds
let pingSound;
let bgMusic1;

// fonts
let logoFont;
let regularFont;

function preload() {
  pingSound = loadSound("assets/ping.mp3");
  bgMusic1 = loadSound("assets/bgMusic1.mp3");
  logoFont = loadFont("assets/Chango-Regular.ttf");
  regularFont = loadFont("assets/FunnelDisplay-Regular.ttf");
  homeIcon = loadImage("assets/home.png");
  instructionsIcon = loadImage("assets/instructions.png");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  // get local highscore
  if (getItem("highest")) {
    highScore = getItem("highest");
  }

  // positions
  midScreen = {
    x: windowWidth / 2,
    y: windowHeight / 2,
  };

  // set machine dimensions
  machineWidth = windowWidth / 4;
  machineHeight = windowHeight * 4/5;

  // make the engine
  engine = Engine.create();
  world = engine.world;

  // render canvas
  let render = Render.create({
    canvas: canvas.elt,
    engine: engine,
    options: { width: width, height: height, showCollisions: true }
  });

  Render.run(render);

  // pinball object
  pinball = new Pinball(midScreen.x + machineWidth / 3 + 35, midScreen.y + machineHeight / 2 - 15, 10);
  
  // bumpers top row
  for (let i = - 4; i < 4; i+= 3) {
    let theBumper = new Bumper(midScreen.x + i * machineWidth / 12, midScreen.y - machineHeight / 3, 10);
    bumpers.push(theBumper);
  }

  // bumpers middle row
  for (let i = - 4; i < 3; i += 3) {
    let theBumper = new Bumper(midScreen.x + i * machineWidth / 12, midScreen.y - machineHeight / 6, 20);
    bumpers.push(theBumper);
  }

  // bumpers bottom row
  for (let i = - 3; i < 2; i+= 3) {
    let theBumper = new Bumper(midScreen.x + i * machineWidth / 12, midScreen.y, 15);
    bumpers.push(theBumper);
  }

  // reset
  reset = new Reset(midScreen.x - machineWidth / 12, midScreen.y + machineHeight / 2 - 10, machineWidth / 6, 20);

  // launchpad
  launchpad = new Launch(midScreen.x + machineWidth / 3 + 35, midScreen.y + machineHeight / 2 - 10, machineWidth / 6, 20);

  // triangle edges on bottom
  let bottomLeft = [
    { x: midScreen.x - machineWidth / 2, y: midScreen.y + machineHeight / 2}, // top corner
    { x: midScreen.x - machineWidth / 2, y: midScreen.y + machineHeight / 3}, // bottom corner
    { x: midScreen.x - machineWidth / 6, y: midScreen.y + machineHeight / 2}, // center
  ];

  let bottomRight = [
    { x: midScreen.x + machineWidth / 3, y: midScreen.y + machineHeight / 3},
    { x: midScreen.x + machineWidth / 3, y: midScreen.y + machineHeight / 2},
    { x: midScreen.x, y: midScreen.y + machineHeight / 2},
  ];

  let topLeft = [
    { x: midScreen.x - machineWidth / 2, y: midScreen.y - machineHeight / 2},
    { x: midScreen.x - machineWidth / 2, y: midScreen.y - machineHeight /3}, 
    { x: midScreen.x, y: midScreen.y - machineHeight / 2}, // center
  ];

  let topRight = [
    { x: midScreen.x + machineWidth / 2, y: midScreen.y - machineHeight / 2},
    { x: midScreen.x + machineWidth / 2, y: midScreen.y - machineHeight /3},
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
  let wallAlley = new Wall(midScreen.x + machineWidth / 3, midScreen.y + machineHeight / 6 + 10, 20, machineHeight * 2/3, 0);
  walls.push(wallAlley);

  // walls
  let wallTop = new Wall(midScreen.x, midScreen.y - machineHeight / 2, machineWidth, 20, 0);
  walls.push(wallTop);
  let wallBottom = new Wall(midScreen.x, midScreen.y + machineHeight / 2, machineWidth, 20, 0);
  walls.push(wallBottom);
  let wallLeft = new Wall(midScreen.x - machineWidth / 2, midScreen.y, 20, machineHeight + 20, 0);
  walls.push(wallLeft);
  let wallRight = new Wall(midScreen.x + machineWidth / 2, midScreen.y, 20, machineHeight + 20, 0);
  walls.push(wallRight);

  // line walls
  let leftUpright = new Wall(midScreen.x - machineWidth * 5/12, midScreen.y + machineHeight / 12, 15, machineWidth / 3, 0);
  walls.push(leftUpright);
  let rightUpright = new Wall(midScreen.x + machineWidth / 4, midScreen.y + machineHeight / 12, 15, machineWidth / 3, 0);
  walls.push(rightUpright);
  let leftSlant = new Wall(midScreen.x - machineWidth / 3, midScreen.y + (sqrt(2) + 1) * machineHeight / (8 * sqrt(2)), 15, machineWidth / 4, -45);
  walls.push(leftSlant);
  let rightSlant = new Wall(midScreen.x + machineWidth / 6, midScreen.y + (sqrt(2) + 1) * machineHeight / (8 * sqrt(2)), 15, machineWidth / 4, 45);
  walls.push(rightSlant);

  // flippers
  lFlipper = new Flipper(midScreen.x - machineWidth / 6, midScreen.y + machineHeight / 3, machineWidth / 5, 15, true);
  rFlipper = new Flipper(midScreen.x, midScreen.y + machineHeight / 3, machineWidth / 5, 15, false);  

  // buttons
  homeButton = new Button(100, 50, homeIcon, "home");
  instructionsButton = new Button(width - 100, 50, instructionsIcon, "instructions");

  // events
  Matter.Events.on(engine, "collisionStart", function(event) {
    for (let pair of event.pairs) {
      let bodyA = pair.bodyA;
      let bodyB = pair.bodyB;

      if (bodyA.label === "pinball") {
        if (bodyB.label === "reset") {
          let ball = bodyA.get;
          score = 0;
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
        else if (bodyB.label === "launch") {
          wasReset = true;
        }
      }
    }
  });
}

function draw() {
  if (gameState === "start") {
    background(0);
    noStroke();
    fill("lightblue");
    textFont(logoFont);
    textSize(75);
    text("Ping-ball", midScreen.x - 240, midScreen.y - 100);
    textFont(regularFont);
    fill("lightpink");
    textSize(45);
    text("Press SPACE to start", midScreen.x - 200, midScreen.y);

    keyPressed();
  }
  else if (gameState === "play") {
    background(0);
    Engine.update(engine);

    keyPressed();
    displayScores();
    displayEntities();
  }
  displayButtons();
  showInstructions();
  mouseClicked();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawMachineBack() {
  push();
  translate(midScreen.x, midScreen.y);
  fill(25);
  rectMode(CENTER);
  rect(0, 0, machineWidth, machineHeight);
  pop();
}

function displayButtons() {
  homeButton.show();
  instructionsButton.show();
}

function displayEntities() {
  // draw background of machine
  drawMachineBack();

  // show bumpers
  for (let bumper of bumpers) {
    bumper.show();
  }
  // reset area
  reset.show();

  // launchpad
  launchpad.show();

  for (let edge of edges) {
    edge.show();
  }

  // show walls
  for (let wall of walls) {
    wall.show();
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
  fill("white");
  textSize(50);
  text(score, 50, height/2);

  fill("white");
  textSize(50);
  text(highScore, width - 100, height/2);
}

class Button {
  constructor(x, y, theImg, buttonType) {
    this.x = x;
    this.y = y;
    this.img = theImg;
    this.type = buttonType;
  }
  // display button
  show() {
    stroke(0);
    if (this.isHovered()) {
      tint("lightblue");
    } else {
      noTint();
    }
    this.img.resize(0, 50);
    image(this.img, this.x, this.y);
  }
  // check to see if button is hovered
  isHovered() {
    if (mouseX > this.x && mouseX < this.x + this.img.width && mouseY > this.y && mouseY < this.y + this.img.height) {
      return true;
    } 
    else {
      return false;
    }
  }
  // click detection
  wasClicked() {
    if (this.isHovered()) {
      if (this.type === "home") {
        gameState = "start";
      }
      if (this.type === "instructions" && !instructionsShown) {
        instructionsShown = true;
      }
      else {
        instructionsShown = false;
      }
    } 
  }
}

function showInstructions() {
  if (instructionsShown) {
    rectMode(CENTER);
    fill(200);
    rect(midScreen.x, midScreen.y, 200, 75);
    fill(0);
    textAlign(CENTER);
    textFont(logoFont);
    textSize(30);
    text("Instructions", midScreen.x, midScreen.y - 75);
    textFont(regularFont);
    textSize(20);
    text("Press SPACE to launch pinball", midScreen.x, midScreen.y - 25);
    textFont(regularFont);
    textSize(20);
    text("Use A and D to control flippers", midScreen.x, midScreen.y + 25);
  }
}

// rectangle box to enclose machine
class Wall {
  constructor(x, y, w, h, angle) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = angle;
    this.color = color(50);

    let options = {
      isStatic: true,
      angle: this.angle
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    Composite.add(world, this.body);
  }
  show() {
    let pos = this.body.position;
    noStroke();

    push();
    translate(pos.x, pos.y);
    fill(this.color);
    rotate(this.angle);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop(); 
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

class Launch extends Wall {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    let options = {
      isStatic: true,
      label: "launch",
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

    Composite.add(world, this.body);
  }
  show() {
    this.color = color(255);
    super.show();
  }
}

// triangle corner on machine
class Edge {
  constructor(vertices) {
    this.color = color(50);
    let options = {
      isStatic: true,
      restitution: 1.25,
    };

    this.centroid = {
      x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
      y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
    };

    this.body = Bodies.fromVertices(this.centroid.x, this.centroid.y, vertices, options);

    Composite.add(world, this.body);
  }

  show() {
    fill(this.color);
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

    // graphics
    this.color = color(random(255), random(255), random(255));

    // return object when called
    this.body.get = this;

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
    Body.setPosition(this.body, { x: midScreen.x + machineWidth / 3 + 30, y: midScreen.y + machineHeight / 4});
    Body.setVelocity(this.body, { x: 0, y: 0 });
  }
  launch() {
    if (wasReset) {
      Body.setVelocity(this.body, { x: -4, y: -30 });
      Body.setAngularVelocity(pinball, 0);
      wasReset = false;
    }
  }
}

class Bumper {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.body = Bodies.circle(this.x, this.y, this.r, { 
      isStatic: true,
      restitution: 1.5,
      label: "bumper",
    });

    this.red = random(100, 225);
    this.green = random(100, 225);
    this.blue = random(100, 225);

    this.color = color(this.red, this.green, this.blue);

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
    let prevColor = self.color;
    self.color = color(random(255), random(255), random(255));
    setTimeout(function() {
      self.color = prevColor;
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
    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height);
    this.velocity = 0.2;

    this.hingeRadius = 5;

    if (isLeft) {
      this.hinge = Bodies.circle(this.x - this.width / 2, this.y, this.hingeRadius, { isStatic: true, label: "hinge" });
    }
    else {
      this.hinge = Bodies.circle(this.x + this.width / 2, this.y, this.hingeRadius, { isStatic: true, label: "hinge" });
    }

    Composite.add(world, this.body);

    let options = {
      bodyA: this.body,
      pointA: isLeft ? { x: - this.width / 2 + 10, y: 0} : { x: this.width / 2 - 10, y: 0 },
      bodyB: this.hinge,
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

    let hingePos = this.hinge.position;
    push();
    translate(hingePos.x, hingePos.y);
    fill(255);
    noStroke();
    circle(0, 0, this.hingeRadius);
    pop();
  }

  hit(isLeft) {
    if (isUp) {
      if (isLeft) {
        console.log(isUp);
        Body.setAngularVelocity(this.body, -this.velocity);
        // isUp = false;
      }
      else {
        console.log(isUp);
        Body.setAngularVelocity(this.body, this.velocity);
        // isUp = false;
      }
    }
    else {
      Body.setAngularVelocity(this.body, 0);
    }
  }
}

// WASD to control flipper movement
function keyPressed() {
  if (key === " ") {
    if (gameState === "start") {
      if (!bgMusic1.isPlaying()) {
        bgMusic1.play();
      }
      else {
        bgMusic1.stop();
      }
      gameState = "play";
    }
  } 
  if (key === "a") {
    isUp = true;
    lFlipper.hit(true);
  }
  if (key === "d") {
    isUp = true;
    rFlipper.hit(false);
  }
}

// just to release flippers
function keyReleased() {
  if (key === "a") {
    isUp = false;
    lFlipper.hit(true);
  }
  if (key === "d") {
    isUp = false;
    rFlipper.hit(false);
  }
  if (key === " ") {
    if (gameState === "play") {
      pinball.launch();
    }
  }
}

// check for clicked objects
function mouseClicked() {
  homeButton.wasClicked();
  instructionsButton.wasClicked();
}