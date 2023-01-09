class Player {
	score = 0;
	x = 0;
	y = 0;
	width = 0;
	height = 0;
	velocity = 0;
	acceleration = 0;
	speed = 0;
	collided = 0;
	roundcount = 0;
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

	constructor(
		x,
		y,
		width,
		height,
		velocity,
		acceleration,
		speed,
		collided,
		roundcount,
		ttl,
		model
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.speed = speed;
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
				if (!this.claimed2 && this.claimed1) {
					this.claimed2 = true;
					returnContent = true;
				}
				break;
			case 3:
				if (!this.claimed3 && this.claimed1 && this.claimed2) {
					this.claimed3 = true;
					returnContent = true;
				}
				break;
			case 4:
				if (!this.claimed4 && this.claimed1 && this.claimed2 && this.claimed3) {
					this.claimed4 = true;
					returnContent = true;
				}
				break;
			case 5:
				if (
					!this.claimed5 &&
					this.claimed1 &&
					this.claimed2 &&
					this.claimed3 &&
					this.claimed4
				) {
					this.claimed5 = true;
					returnContent = true;
				}
				break;
			case 6:
				if (
					!this.claimed6 &&
					this.claimed1 &&
					this.claimed2 &&
					this.claimed3 &&
					this.claimed4 &&
					this.claimed5
				) {
					this.claimed6 = true;
					returnContent = true;
				}
				break;
			case 7:
				if (
					!this.claimed7 &&
					this.claimed1 &&
					this.claimed2 &&
					this.claimed3 &&
					this.claimed4 &&
					this.claimed5 &&
					this.claimed6
				) {
					this.claimed7 = true;
					returnContent = true;
				}
				break;
			case 8:
				if (
					!this.claimed8 &&
					this.claimed1 &&
					this.claimed2 &&
					this.claimed3 &&
					this.claimed4 &&
					this.claimed5 &&
					this.claimed6 &&
					this.claimed7
				) {
					this.claimed8 = true;
					returnContent = true;
					break;
				}
			default:
				returnContent = false;
		}
		if (returnContent) {
			this.roundcount++;
			this.score += 50;
		}
		return returnContent;
	}
}
