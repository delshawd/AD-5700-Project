let balls = [];
let ballSpeed = 3;
let catcherX = 320;
let score = 0;

let video;
let handPose;
let hands = [];
let mic;

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  mic = new p5.AudioIn();
  mic.start();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);
}

function draw() {
  background(0);

  // HandPose - Lesson 4.2
  if (hands.length > 0) {
    let hand = hands[0];
    let indexFinger = hand.keypoints[8];

    catcherX = width - indexFinger.x;
  }

  // Score
  fill(255);
  textSize(20);
  text("Score: " + score, 20, 30);

  // Catcher
  fill(0, 255, 0);
  rect(catcherX - 50, height - 40, 100, 20);

  // Microphone - Lesson 3.1
  let volume = mic.getLevel();

  if (volume > 0.05) {
    ballSpeed = 1;
  } else {
    ballSpeed = 3;
  }

  // Frame counting - Lesson 4.2
  // Ball objects - Lesson 4.1
  if (frameCount % 60 === 0) {
    balls.push(new Ball(random(30, width - 30), 20, 15));
  }

  // Moving balls - Lesson 4.1
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];

    // Adaptation: make the ball fall downward
    ball.velocity.x = 0;
    ball.velocity.y = ballSpeed;

    ball.update();
    ball.display();

    // Adaptation: catch the ball with a rectangle
    if (ball.position.y >= height - 40 &&
        ball.position.y <= height - 20 &&
        ball.position.x >= catcherX - 50 &&
        ball.position.x <= catcherX + 50) {

      score++;
      balls.splice(i, 1);

    } else if (ball.position.y > height) {

      // Game Over - Lesson 4.1
      background(0);

      fill(255);
      textAlign(CENTER);

      textSize(40);
      text("YOU LOSE", width / 2, height / 2);

      textSize(20);
      text("Final Score: " + score, width / 2, height / 2 + 40);

      noLoop();
      return;
    }
  }
}

function gotHands(results) {
  hands = results;
}