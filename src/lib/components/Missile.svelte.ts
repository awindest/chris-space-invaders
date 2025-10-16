export class Missile {
	constructor(canvasContext, { position, velocity }) {
		this.canvasContext = canvasContext
		this.position = position
		this.velocity = velocity

		this.radius = 4
	}
	draw() {
		this.canvasContext.beginPath()
		this.canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		this.canvasContext.fillStyle = 'red'
		this.canvasContext.fill()
		this.canvasContext.closePath()
	}
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}
