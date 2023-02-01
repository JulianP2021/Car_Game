class Ray {
	x = 0;
	y = 0;
	angle = 0;
	stopped = false;
    velocity = 5;

	constructor(x, y, angle, stopped) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.stopped = stopped;
	}
}
