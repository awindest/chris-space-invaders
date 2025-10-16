export class InvaderMissile {
	constructor(canvasContext, { position, velocity }) {
		this.canvasContext = canvasContext
		this.position = position
		this.velocity = velocity

		this.width = 3
		this.height = 10
	}
	draw() {
		this.canvasContext.fillStyle = 'white'
		this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}
