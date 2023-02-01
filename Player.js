class Player {
	score = 0;
	startx = 0;
	starty = 0;
	x = 0;
	y = 0;
	width = 0;
	height = 0;
	velocity = 0;
	collided = 0;
	roundcount = 0;
	angle = 0;
	ttl = 0;
	model;
	claimed1 = false;
	claimed2 = false;
	claimed3 = false;
	claimed4 = false;
	claimed5 = false;
	claimed6 = false;
	claimed7 = false;
	claimed8 = false;

	constructor(startx, starty, width, height, velocity, collided, roundcount, ttl, model) {
		this.startx = startx;
		this.starty = starty;
		this.x = startx;
		this.y = starty;
		this.width = width;
		this.height = height;
		this.velocity = velocity;
		this.collided = collided;
		this.roundcount = roundcount;
		this.ttl = ttl;
		this.model = model;
	}

	resetRewards() {
		this.claimed1 = false;
		this.claimed2 = false;
		this.claimed3 = false;
		this.claimed4 = false;
		this.claimed5 = false;
		this.claimed6 = false;
		this.claimed7 = false;
		this.claimed8 = false;
	}

	claim(x) {
		let returnContent = false;
		switch (x + 1) {
			case 1:
				if (!this.claimed1) {
					this.claimed1 = true;
					returnContent = true;
				}
				break;
			case 2:
				if (!this.claimed2) {
					this.claimed2 = true;
					returnContent = true;
				}
				break;
			case 3:
				if (!this.claimed3) {
					this.claimed3 = true;
					returnContent = true;
				}
				break;
			case 4:
				if (!this.claimed4) {
					this.claimed4 = true;
					returnContent = true;
				}
				break;
			case 5:
				if (!this.claimed5) {
					this.claimed5 = true;
					returnContent = true;
				}
				break;
			case 6:
				if (!this.claimed6) {
					this.claimed6 = true;
					returnContent = true;
				}
				break;
			case 7:
				if (!this.claimed7) {
					this.claimed7 = true;
					returnContent = true;
				}
				break;
			case 8:
				if (!this.claimed8) {
					this.claimed8 = true;
					returnContent = true;
					break;
				}
			default:
				returnContent = false;
		}
		if (returnContent) {
			this.roundcount++;
			this.score += 500;
		}
		return returnContent;
	}
	detectEnvironment(matrix) {
		let rays = [];
		rays.push(new Ray(this.x, this.y, this.angle + 0.4, false));
		rays.push(new Ray(this.x, this.y, this.angle + 0.2, false));
		rays.push(new Ray(this.x, this.y, this.angle, false));
		rays.push(new Ray(this.x, this.y, this.angle - 0.2, false));
		rays.push(new Ray(this.x, this.y, this.angle - 0.4, false));
		let counter = 0;
		while (
			rays.filter(ray => {
				return ray.stopped;
			}).length != rays.length &&
			counter < 100
		) {
			counter++;
			for (let ray of rays) {
				if (
					Math.floor(ray.x) > 0 &&
					Math.floor(ray.y) > 0 &&
					Math.floor(ray.x) < 1000 &&
					Math.floor(ray.y) < 1000 &&
					matrix[Math.floor(ray.x)][Math.floor(ray.y)] == 0
				) {
					ray.stopped = true;
				} else {
					ray.x += Math.cos(ray.angle) * ray.velocity; // Update the player's position
					ray.y += Math.sin(ray.angle) * ray.velocity;
				}
			}
		}
		let returnC = [];
		for (let ray of rays) {
			returnC[rays.indexOf(ray)] = [];
			returnC[rays.indexOf(ray)][0] = ray.x-this.x;
			returnC[rays.indexOf(ray)][1] = ray.y-this.y;
		}
		return returnC;
	}

	reset() {
		this.x = this.startx;
		this.y = this.starty;
		this.score = 0;
		this.collided = false;
		this.claimed1 = false;
		this.angle = 0;
		this.resetRewards();
		return this;
	}

	copyModelWeights() {
		let weights = this.model.getWeights();
		let weightsCopy = [];
		console.log(weights);
		for (let weight of weights) {
			weightsCopy.push(weight.clone());
		}
		console.log(weightsCopy);
		return weightsCopy;
	}

	copyModel() {
		let newModel = getBaseModel();
		let weights = this.model.getWeights();
		let weightsCopy = [];
		for (let weight of weights) {
			weightsCopy.push(weight.clone());
		}
		newModel.setWeights(weightsCopy);
		return newModel;
	}
}
