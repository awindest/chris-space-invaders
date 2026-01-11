import type { FireballType, PositionType, VelocityType } from '$lib/types'
import { Fireball } from '$components/Fireball.svelte'
import { Particle } from '$components/Particle.svelte'

export class Player {
	canvasContext: CanvasRenderingContext2D
	canvasWidth: number
	canvasHeight: number
	position: PositionType
	velocity: VelocityType
	rotation: number = 0
	opacity: number = 0
	image: HTMLImageElement
	width: number = 0
	height: number = 0
	particles: Particle[] = []
	frames: number = 0

	constructor(canvasContext: CanvasRenderingContext2D) {
		this.canvasContext = canvasContext
		this.canvasWidth = canvasContext.canvas.width
		this.canvasHeight = canvasContext.canvas.height
		this.position = {
			x: 0,
			y: 0
		}
		this.velocity = {
			x: 0,
			y: 0
		}

		this.image = new Image()
		this.image.src = '/images/PlayerSpaceship.png'
		this.image.onload = () => {
			const scale = 0.15
			this.width = this.image.width * scale
			this.height = this.image.height * scale
			this.position.x = this.canvasWidth / 2 - this.width / 2
			this.position.y = this.canvasHeight - this.height - 25
		}

		this.rotation = 0
		this.opacity = 1

		// this.particles = []
		this.frames = 0
	}
	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x

			this.frames++

			if (this.frames % 2 === 0) {
				this.particles.push(
					new Particle(this.canvasContext, {
						position: {
							x: this.position.x + this.width / 2,
							y: this.position.y + this.height
						},
						velocity: {
							x: (Math.random() - 0.5) * 1.5,
							y: 1.4
						},
						radius: Math.random() * 2,
						color: 'white',
						fades: true
					})
				)
			}

		}
	}
	draw() {
		this.canvasContext.save()
		this.canvasContext.globalAlpha = this.opacity
		this.canvasContext.translate(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		)
		this.canvasContext.rotate(this.rotation)
		this.canvasContext.translate(
			-this.position.x - this.width / 2,
			-this.position.y - this.height / 2
		)
		this.canvasContext.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
		this.canvasContext.restore()
	}

	shoot(fireballs: FireballType[]) {
		fireballs.push(
			new Fireball(this.canvasContext, {
				position: {
					x: this.position.x + this.width / 2,
					y: this.position.y - this.height
				},
				velocity: {
					x: 0,
					y: -5 // used to be -10 but I slowed it down.
				}
			})
		)
	}
}
