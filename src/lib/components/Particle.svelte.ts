import type { PositionType, VelocityType } from '$lib/types'

export class Particle {
	canvasContext: CanvasRenderingContext2D
	position: PositionType
	velocity: VelocityType
	radius: number
	color: string
	fades: boolean
	opacity: number
	constructor(canvasContext: CanvasRenderingContext2D,
		{ position, velocity, radius, color, fades }:
			{ position: PositionType; velocity: VelocityType; radius: number; color: string; fades: boolean }
	) {
		this.canvasContext = canvasContext
		// this.position = { ...position }
		// this.velocity = { ...velocity }
		this.position = position
		this.velocity = velocity
		this.radius = radius
		this.color = color // | 'white'
		this.fades = fades // | 'false'
		this.opacity = 1.0
	}

	draw(): void {
		this.canvasContext.save()
		this.canvasContext.globalAlph = this.opacity
		this.canvasContext.beginPath()
		this.canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		this.canvasContext.fillStyle = this.color
		this.canvasContext.fill()
		this.canvasContext.closePath()
		this.canvasContext.restore()
	}
	update(): void {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.fades) {
			this.opacity -= 0.01
		}
	}
}
