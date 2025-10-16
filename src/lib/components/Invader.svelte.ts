import { InvaderMissile } from '$components/InvaderMissile.svelte'
export class Invader {
	constructor(canvasContext, { position }) {

		this.canvasContext = canvasContext
		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image()
		image.src = '/invader.png'
		image.onload = () => {
			const scale = 1
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: position.x,
				y: position.y
			}
		}
	}
	draw() {
		// context.fillStyle = 'red'
		// context.fillRect(this.position.x, this.position.y, this.width, this.height)

		this.canvasContext.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
	}
	update({ velocity }) {
		if (this.image) {
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}

	shoot(invaderMissiles) {
		invaderMissiles.push(
			new InvaderMissile(this.canvasContext, {
				position: {
					x: this.position.x + this.width / 2,
					y: this.position.y + this.height
				},
				velocity: {
					x: 0,
					y: 5
				}
			})
		)
	}
}
