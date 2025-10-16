import type { Game } from '$lib/types'


export class Player {
	constructor(canvasContext, canvasWidth, canvasHeight) {

		this.context = canvasContext

		this.velocity = {
			x: 0,
			y: 0
		}

		this.rotation = 0
		this.opacity = 1

		const image = new Image()
		image.src = '/images/PlayerSpaceship.png'
		image.onload = () => {
			const scale = 0.15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: canvasWidth / 2 - this.width / 2,
				y: canvasHeight - this.height - 25
			}
		}
	}



	draw() {

		this.context.save()
		this.context.globalAlpha = this.opacity
		this.context.translate(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		)
		this.context.rotate(this.rotation)
		this.context.translate(
			-this.position.x - this.width / 2,
			-this.position.y - this.height / 2
		)
		this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
		this.context.restore()
	}
	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
		}
	}
}
