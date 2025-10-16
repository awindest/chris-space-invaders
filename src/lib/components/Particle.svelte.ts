export class Particle {
	constructor(canvasContext, { position, velocity, radius, color, fades }) {
		this.canvasContext = canvasContext
		this.position = position
		this.velocity = velocity

		this.radius = radius
		this.color = color
		this.opacity = 1.0
		this.fades = fades || false
	}
	draw() {
		this.canvasContext.save()
		this.canvasContext.globalAlph = this.opacity
		this.canvasContext.beginPath()
		this.canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		this.canvasContext.fillStyle = this.color
		this.canvasContext.fill()
		this.canvasContext.closePath()
		this.canvasContext.restore()
	}
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.fades) {
			this.opacity -= 0.01
		}
	}
}
