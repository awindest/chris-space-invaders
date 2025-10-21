import { Invader } from '$components/Invader.svelte'

export class InvaderGrid {
	constructor(canvasContext, canvasWidth, frameCounter, invaderSpriteSheet) {

		// this.canvasContext = canvasContext
		this.canvasWidth = canvasWidth

		this.position = {
			x: 0,
			y: 0
		}

		this.velocity = {
			x: 3,
			y: 0
		}
		this.invaders = []
		const columns = Math.floor(Math.random() * 10 + 5) // two to seven rows
		const rows = Math.floor(Math.random() * 5 + 2) // two to seven rows

		this.width = columns * 30

		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(
					new Invader(canvasContext, frameCounter, invaderSpriteSheet, {
						position: {
							x: x * 30,
							y: y * 30
						}
					})
				)
			}
		}
	}
	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0 //otherwise the grid would go off screen

		if (this.position.x + this.width > this.canvasWidth || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y = 30
		}
	}
}
