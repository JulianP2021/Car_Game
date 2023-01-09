// Set up the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
let down = true;
let up = true;
function resizeCanvas() {
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 120;
}
function createPlayer(weights) {
	let newModel = getBaseModel();
	newModel.setWeights(weights);
	return new Player(
		400,
		150,
		20,
		20,
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		5,
		false,
		0,
		200,
		newModel
	);
}
window.addEventListener("resize", resizeCanvas);

// Initialize the canvas size
resizeCanvas();

let MOVES = ["W", "A", "S", "D"];
let rewards = [];

rewards.push(new Reward(150, 150, 250, 230));
rewards.push(new Reward(100, 300, 200, 300));
rewards.push(new Reward(150, 450, 250, 350));
rewards.push(new Reward(180, 500, 270, 350));

rewards.push(new Reward(500, 400, 500, 500));
rewards.push(new Reward(750, 350, 850, 450));
rewards.push(new Reward(800, 300, 900, 300));
rewards.push(new Reward(750, 250, 850, 150));
rewards.push(new Reward(500, 100, 500, 200));

//

// Set up the player
const player1 = new Player(
	300,
	150,
	20,
	20,
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	5,
	false,
	0,
	100,
	tf.sequential({
		layers: [
			tf.layers.dense({ inputShape: [2], units: 2, activation: "relu" }),
			tf.layers.dense({ units: 9, activation: "relu" }),
			tf.layers.dense({ units: MOVES.length, activation: "relu" }),
		],
	})
);

let players = [];
for (let i = 0; i < 100; i++) {
	players.push(createPlayer(getBaseModel().getWeights()));
}

players.push(player1);

// Set up the key codes
const keys = {
	w: 87,
	a: 65,
	s: 83,
	d: 68,
};

let features = [];
let labels = [];

// Set up the key state
const keyState = {};

// Set up the animation loop
async function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	paintTrack();
	for (let player of players) {
		// Clear the canvas

		let x = player.x;
		let y = player.y;
		// Update the player's position based on the key state
		if (player == player1) {
			if (keyState[keys.w]) {
				player.velocity.y = -player.speed;
			}
			if (keyState[keys.a]) {
				player.velocity.x = -player.speed;
			}
			if (keyState[keys.s]) {
				player.velocity.y = player.speed;
			}
			if (keyState[keys.d]) {
				player.velocity.x = player.speed;
			}
		} else {
			let prediction = Array.from(
				player.model
					.predict(tf.tensor([[player.x, player.y]], [1, 2]))
					.dataSync()
			).lastIndexOf(
				Math.max(
					...Array.from(
						player.model
							.predict(tf.tensor([[player.x, player.y]], [1, 2]))
							.dataSync()
					)
				)
			);
			if (prediction == 0) {
				player.velocity.y = -player.speed;
			}
			if (prediction == 1) {
				player.velocity.x = -player.speed;
			}
			if (prediction == 2) {
				player.velocity.y = player.speed;
			}
			if (prediction == 3) {
				player.velocity.x = player.speed;
			}
			player.score++;
		}

		player.velocity.x += player.acceleration.x; // Update the player's velocity
		player.velocity.y += player.acceleration.y;
		player.x += player.velocity.x; // Update the player's position
		player.y += player.velocity.y;

		player.velocity.x = 0;
		player.velocity.y = 0;
		// Draw the player
		if (player.collided) {
			player.score--;
			player.ttl = 0;
			ctx.fillStyle = "green";
		} else {
			ctx.fillStyle = "blue";
		}

		ctx.fillRect(
			(player.x * canvas.width) / 1000,
			(player.y * canvas.width) / 1000,
			player.width,
			player.height
		);
		detectCollision(player);
		updateRoundcout(player);

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
	}
	if (
		players.filter(player => {
			if (player.ttl > 0) return true;
			return false;
		}).length == 0
	) {
		nextGen();
	}

	// Request the next animation frame
	requestAnimationFrame(update);
}

// Set up the keydown event listener
window.addEventListener("keydown", function (e) {
	keyState[e.keyCode] = true;
});

// Set up the keyup event listener
window.addEventListener("keyup", function (e) {
	keyState[e.keyCode] = false;
});

function paintTrack() {
	ctx.fillStyle = "black";
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
function detectCollision(player) {
	let positions = [];
	positions[0] = ctx.getImageData(
		(player.x * canvas.width) / 1000 - 1,
		(player.y * canvas.width) / 1000 - 1,
		1,
		1
	);
	positions[1] = ctx.getImageData(
		(player.x * canvas.width) / 1000 + player.width,
		(player.y * canvas.width) / 1000 - 1,
		1,
		1
	);
	positions[2] = ctx.getImageData(
		(player.x * canvas.width) / 1000 - 1,
		(player.y * canvas.width) / 1000 + player.height,
		1,
		1
	);
	positions[3] = ctx.getImageData(
		(player.x * canvas.width) / 1000 + player.width,
		(player.y * canvas.width) / 1000 + player.height,
		1,
		1
	);
	for (let imageData of positions) {
		const r = imageData.data[0];
		const g = imageData.data[1];
		const b = imageData.data[2];
		const a = imageData.data[3];
		// Check if the player and line intersect
		if (r == 255 && g == 0 && b == 0) {
			player.collided = true;
		}
		//FinishLine
		if (r == 255 && g == 255 && b == 0) {
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
function updateRoundcout(player) {
	if (player == player1) {
		document.getElementById("rc").innerHTML =
			"Roundcount: " + player.roundcount;
	}
}

function nextGen() {
	let newPlayers = [];
	let playerToLookAt = players[0];
	let maxscore = 0;
	for (let i = 0; i < players.length; i++) {
		if (players[i] != player1 && maxscore <= players[i].score) {
			playerToLookAt = players[i];
			maxscore = players[i].score;
		}
	}
	console.log(playerToLookAt);
	for (let i = 0; i < players.length - 1; i++) {
		newPlayers.push(mutate(playerToLookAt));
	}
	newPlayers.push(player1);
	players = newPlayers;
}

function mutate(player) {
	let weightsCopy = player.model.getWeights();
	let mutatedWeights = [];
	for (let i = 0; i < weightsCopy.length; i++) {
		let tensor = weightsCopy[i];
		let shape = weightsCopy[i].shape;
		let values = tensor.dataSync().slice();
		for (let i = 0; i < values.length; i++) {
			if (Math.random() < 0.3) {
				let w = values[i];
				values[i] = w + (Math.random() - 0.5) * 2;
			}
		}
		let newTensor = tf.tensor(values, shape);
		mutatedWeights[i] = newTensor;
	}
	let player2 = createPlayer(mutatedWeights);
	return player2;
}

function getBaseModel() {
	//copy
	return tf.sequential({
		layers: [
			tf.layers.dense({ inputShape: [2], units: 2, activation: "relu" }),
			tf.layers.dense({ units: 9, activation: "relu" }),
			tf.layers.dense({ units: MOVES.length, activation: "relu" }),
		],
	});
}

update();
