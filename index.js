// Set up the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
let started = false;
let createdTrack = false;
let drawStart = false;
let startx = 300;
let starty = 130;
//tf.setBackend("cpu");
//const AI_used = new OldAI_1();

function resizeCanvas() {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 120;
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resizeCanvas);

// Initialize the canvas size
resizeCanvas();

let MOVES = ["A", "D", "W"];
let rewards = [];
let matrix = [];
for (let i = 0; i < 1000; i++) {
  matrix[i] = [];
  for (let j = 0; j < 1000; j++) {
    matrix[i][j] = 0;
  }
}

let createdMatrix;

rewards.push(new Reward(150, 150, 250, 230));
rewards.push(new Reward(100, 300, 200, 300));
rewards.push(new Reward(150, 450, 250, 350));
rewards.push(new Reward(500, 400, 500, 500));
rewards.push(new Reward(750, 350, 850, 450));
rewards.push(new Reward(800, 300, 900, 300));
rewards.push(new Reward(750, 250, 850, 150));
rewards.push(new Reward(500, 100, 500, 200));

//

// Set up the player
const player1 = new Player(
  400,
  150,
  10,
  10,
  { x: 0, y: 0 },
  0.1,
  2,
  { x: -1, y: -1 },
  false,
  0,
  Infinity,
  null,
  //AI_used.getBaseModel()
);

let players = [];

//player1.velocity = { x: 1.2, y: 1.2 };
//player1.acceleration = { x: 1.0, y: 0.95 };
player1.lerp(1);
console.log(player1.velocity);

canvas.addEventListener("click", (e) => {
  if (!started) {
    if (drawStart) {
      startx = (e.offsetX / canvas.width) * 1000;
      starty = (e.offsetY / canvas.width) * 1000;
    } else {
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
    }
    createdTrack = true;
  }
});

// Set up the key codes
const keys = {
  w: 87,
  a: 65,
  s: 83,
  d: 68,
  crtl: 16,
};

let features = [];
let labels = [];

// Set up the key state
const keyState = {};

// Set up the animation loop
async function update() {
  /*if (!createdMatrix) {
    paintTrack();
  }*/
  paintTrack();
  for (let player of players) {
    let wpressed = false;
    let spressed = false;
    let apressed = false;
    let dpressed = false;
    player.isDrifting = true;
    if (!player.collided) {
      // Update the player's position based on the key state
      if (player == player1) {
        if (keyState[keys.w]) {
          wpressed = true;
        }
        if (keyState[keys.s]) {
          spressed = true;
        }
        if (keyState[keys.a]) {
          apressed = true;
        }
        if (keyState[keys.d]) {
          dpressed = true;
        }
        if (keyState[keys.crtl]) {
          player.isDrifting = true;
        }
      }/* else {
        let detection = player.detectEnvironment(matrix, canvas, ctx);
        let marginLeft = Math.sqrt(
          Math.pow(detection[0][0], 2) + Math.pow(detection[0][1], 2)
        );
        let marginFrontLeft = Math.sqrt(
          Math.pow(detection[1][0], 2) + Math.pow(detection[1][1], 2)
        );
        let marginFront = Math.sqrt(
          Math.pow(detection[2][0], 2) + Math.pow(detection[2][1], 2)
        );
        let marginFrontRight = Math.sqrt(
          Math.pow(detection[3][0], 2) + Math.pow(detection[3][1], 2)
        );
        let marginRight = Math.sqrt(
          Math.pow(detection[4][0], 2) + Math.pow(detection[4][1], 2)
        );
        const input = [
          [
            player.angle,
            marginLeft,
            marginFrontLeft,
            marginFront,
            marginFrontRight,
            marginRight,
          ],
        ];
        let prediction = -1;
        if (AI_used.predict) {
          player.moves.push(prediction.lastIndexOf(Math.max(...prediction)));
          player.inputs.push(input);
          let used_angle = angle;
          if (angle > 90 || angle < 90) {
            used_angle = -angle - 1;
          }
          prediction = AI_used.predict(players);
        } else {
          let predictions = Array.from(
            player.model.predict(tf.tensor(input, [1, 6])).dataSync()
          );
          prediction = predictions.lastIndexOf(Math.max(...predictions));
        }
        if (prediction == 0) {
          wpressed = true;
        }
        if (prediction == 1) {
          apressed = true;
        }
        if (prediction == 2) {
          dpressed = true;
        }
        player.score++;
      }*/
      let drag = 0.98;
      let inputVertical = wpressed ? 1 : 0;
      inputVertical = spressed ? -1 : inputVertical;
      let inputHorizontal = apressed ? -1 : 0;
      inputHorizontal = dpressed ? 1 : inputHorizontal;
      let move = { x: 0, y: 0 };
      let friction = 1;
      if (player.isDrifting) {
        player.acceleration.x =
          player.moveSpeed * inputVertical * Math.cos(player.angle);
        player.acceleration.y =
          player.moveSpeed * inputVertical * Math.sin(player.angle);
        player.velocity.x += player.acceleration.x;
        player.velocity.x *= drag;
        player.velocity.y += player.acceleration.y;
        player.velocity.y *= drag;
        player.angle += inputHorizontal * 0.04;
        player.limitSpeed();
        player.lerp(1);
        move.x += player.velocity.x;
        move.y += player.velocity.y;
      }
      player.x += move.x; // Update the player's position
      player.y += move.y;
      detectCollision(player);
      player.ttl--;
      if (
        player.claimed1 &&
        player.claimed2 &&
        player.claimed3 &&
        player.claimed4 &&
        player.claimed5 &&
        player.claimed6 &&
        player.claimed7 &&
        player.claimed8
      ) {
        player.resetRewards();
      }

      updateRoundcount(player);
      drawCar(player);

    }
  }
  if (
    players.filter((player) => {
      if (player.ttl > 0) return true;
      return false;
    }).length == 0
  ) {
    /*if (document.getElementById("PlayerAmount").value != 0) {
      //players = AI_used.nextGen(players);

      ctx.fillStyle = "yellow";
      ctx.fillRect(
        (players[0].x * canvas.width) / 1000,
        (players[0].y * canvas.width) / 1000,
        10,
        10
      );
    }*/
    player1.reset();
  }
  // Request the next animation frame
  requestAnimationFrame(update);
}

// Set up the keydown event listener
window.addEventListener("keydown", async function (e) {
  console.log("key down", e.key);
  keyState[e.keyCode] = true;
  if (e.key == "r") {
    if (!started) {
      createdMatrix = false;
      start();
      update();
      started = true;
    }
  }
  if (e.key == "y") {
    drawStart = true;
  }
  /*if (e.key == "f") {
    draw = true;
  }
  if (e.key == "g") {
    await saveBestModel();
  }
  if (e.key == "l") {
    document.getElementById("loadModel").style.display = "flex";
  }*/
});

/*const jsonUpload = document.getElementById("json-upload");
const weightsUpload = document.getElementById("weights-upload");
weightsUpload.addEventListener("input", async (ev) => {
  let model = await tf.loadLayersModel(
    tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]])
  );
  initialGen(AI_used.createPlayerwithModel(model));
});
*/
// Set up the keyup event listener
window.addEventListener("keyup", function (e) {
  console.log("key up");
  keyState[e.keyCode] = false;
});

function paintMatrix() {
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      if (matrix[i][j] == 0) {
        ctx.fillStyle = "red";
      } else if (matrix[i][j] == 2) {
        ctx.fillStyle = "yellow";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect((i * canvas.width) / 1000, (j * canvas.width) / 1000, 1, 1);
    }
  }
}

function start() {
  /*if (document.getElementById("PlayerAmount").value != 0) {
    for (let i = 0; i < document.getElementById("PlayerAmount").value; i++) {
      players.push(AI_used.createPlayer(AI_used.getBaseModel().getWeights()));
    }
  }*/
  //qTable: 0 links margin größer,1 gleich groß, 2 rechts größer, ..., 0 Abstand kleiner 2*tracksize, 1 Abstand größer
  /*for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      for (let k = 0; k <= 2; k++) {
        players[0].qTable[i][j][0][k] = 0;
      }
      players[0].qTable[i][j][1][0] = 1;
    }
  }*/
  console.log("start");

  players.push(player1);
}

function paintTrack() {
  if (createdTrack && createdMatrix) {
    paintMatrix();
  } else if (!createdTrack) {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // Draw the track
    ctx.beginPath();
    // Outer section
    ctx.arc(
      (300 * canvas.width) / 1000,
      (300 * canvas.width) / 1000,
      (200 * canvas.width) / 1000,
      Math.PI / 2,
      Math.PI * 1.5,
      false
    ); // Outer oval
    ctx.arc(
      (700 * canvas.width) / 1000,
      (300 * canvas.width) / 1000,
      (200 * canvas.width) / 1000,
      (Math.PI * 3) / 2,
      Math.PI * 2.5,
      false
    ); // Outer oval
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.moveTo((300 * canvas.width) / 1000, (500 * canvas.width) / 1000);
    ctx.lineTo((700 * canvas.width) / 1000, (500 * canvas.width) / 1000); // Straight section
    //Inner section
    ctx.moveTo((300 * canvas.width) / 1000, (400 * canvas.width) / 1000);
    ctx.arc(
      (300 * canvas.width) / 1000,
      (300 * canvas.width) / 1000,
      (100 * canvas.width) / 1000,
      Math.PI / 2,
      Math.PI * 1.5,
      false
    ); // Outer oval
    ctx.arc(
      (700 * canvas.width) / 1000,
      (300 * canvas.width) / 1000,
      (100 * canvas.width) / 1000,
      (Math.PI * 3) / 2,
      Math.PI * 2.5,
      false
    ); // Outer ovala
    ctx.moveTo((300 * canvas.width) / 1000, (400 * canvas.width) / 1000);
    ctx.lineTo((700 * canvas.width) / 1000, (400 * canvas.width) / 1000); // Straight section
    ctx.strokeStyle = "red";
    ctx.lineWidth = (10 * canvas.width) / 1000;
    ctx.stroke();
    ctx.beginPath();
    //FinishLine
    for (let i = 0; i < rewards.length; i++) {
      const reward = rewards[i];
      ctx.moveTo(
        (reward.x * canvas.width) / 1000,
        (reward.y * canvas.width) / 1000
      );
      ctx.lineTo(
        (reward.xE * canvas.width) / 1000,
        (reward.yE * canvas.width) / 1000
      );
      ctx.strokeStyle = "yellow";
    }
    ctx.stroke();
  }

  if (!createdMatrix) {
    let r = 0;
    let g = 0;
    let w = 0;
    for (let i = 0; i < 1000; i++) {
      for (let j = 0; j < 1000; j++) {
        let data = ctx.getImageData(
          (i * canvas.width) / 1000,
          (j * canvas.width) / 1000,
          1,
          1
        ).data;
        if (data[0] == 255 && data[1] == 0 && data[2] == 0) {
          //rot
          r++;
          matrix[i][j] = 0;
        } else if (data[0] == 255 && data[1] == 255 && data[2] == 0) {
          //gelb
          g++;
          matrix[i][j] = 2;
        } else {
          //weiß
          w++;
          matrix[i][j] = 1;
        }
      }
    }
    createdMatrix = true;
  }
}
function detectCollision(player) {
  if (player.velocity == 0) {
    player.collided = true;
    player.ttl = 0;
  }
  let positions = [];
  positions[0] = [player.x - 1, player.y - 1];

  positions[1] = [player.x + player.width, player.y - 1];

  positions[2] = [player.x - 1, player.y + player.height];
  positions[3] = [player.x + player.width, player.y + player.height];
  for (let position of positions) {
    if (
      Math.floor(position[0]) < 0 ||
      Math.floor(position[1]) < 0 ||
      Math.floor(position[0]) > 1000 ||
      Math.floor(position[1]) > 1000 ||
      matrix[Math.floor(position[0])][Math.floor(position[1])] == 0
    ) {
      player.collided = true;
      player.ttl = 0;
    }
    //FinishLine
    if (
      Math.floor(position[0]) > 0 &&
      Math.floor(position[1]) > 0 &&
      Math.floor(position[0]) < 1000 &&
      Math.floor(position[1]) < 1000 &&
      matrix[Math.floor(position[0])][Math.floor(position[1])] == 2
    ) {
      for (let reward of rewards) {
        if (
          (reward.x - 10 < player.x &&
            reward.xE + 10 > player.x &&
            reward.y - 10 < player.y &&
            reward.yE + 10 > player.y) ||
          (reward.x - 10 < player.x &&
            reward.xE + 10 > player.x &&
            reward.y + 10 > player.y &&
            reward.yE - 10 < player.y)
        ) {
          player.claim(rewards.indexOf(reward));
        }
      }
    }
  }
}

function drawCar(player) {
  ctx.save();
  ctx.fillStyle = "blue";
  // Translate the canvas to the center of the car
  ctx.translate(
    (player.x / 1000) * canvas.width +
    ((player.width / 1000) * canvas.width) / 2,
    (player.y / 1000) * canvas.width +
    ((player.height / 1000) * canvas.width) / 2
  );

  // Rotate the canvas around the center of the car
  ctx.rotate(player.angle);

  // Draw the car
  /*var img = new Image();
  img.src = "/img/car.png";
  img.width = player.width;
  img.height = player.height;
  ctx.drawImage(
    img,
    ((-player.width / 1000) * canvas.width) / 2,
    ((-player.height / 1000) * canvas.width) / 2,
    (player.width / 1000) * canvas.width,
    (player.height / 1000) * canvas.width
  );*/
  ctx.fillRect(
    ((-player.width / 1000) * canvas.width) / 2,
    ((-player.height / 1000) * canvas.width) / 2,
    (player.width / 1000) * canvas.width,
    (player.height / 1000) * canvas.width
  );

  // Restore the canvas state
  ctx.restore();
}
function updateRoundcount(player) {
  if (player == player1) {
    document.getElementById("rc").innerHTML =
      "Roundcount: " + player.roundcount;
  }
}

/*function initialGen(bestPlayer) {
  for (let i = 0; i < players.length; i++) {
    players[i] = bestPlayer;
  }
}*/

/*async function saveBestModel() {
  players = players.sort((a, b) => b.score - a.score);
  let bestModel = players[0].copyModel();
  await bestModel.save("downloads://my-model");
}*/
ctx.fillStyle = "red";
ctx.fillRect(0, 0, (1000 * canvas.width) / 1000, (1000 * canvas.width) / 1000);
