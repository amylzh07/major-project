// Sonic Stunts: A Music-Inspired Pinball Machine
// Amy Lening Zhang
// January 26, 2024

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(5, 5, 200);

  noStroke();
  fill(224, 17, 95);
  circle(mouseX, mouseY, 50);
}