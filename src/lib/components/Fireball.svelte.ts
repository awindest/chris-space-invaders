import { cFireball } from "$lib/config.svelte"
import type { PositionType, VelocityType } from "$lib/types"
export class Fireball {
	canvasContext: CanvasRenderingContext2D
	canvasWidth: number
	canvasHeight: number
	position: PositionType
	velocity: VelocityType
	frameY: number
	timer: number
	fps: number
	interval: number
	image?: HTMLImageElement
	constructor(canvasContext: CanvasRenderingContext2D, { position, velocity }) {

		this.canvasContext = canvasContext
		this.canvasWidth = canvasContext.canvas.width
		this.canvasHeight = canvasContext.canvas.height
		this.position = position
		this.velocity = velocity

		// this.markedForDeletion = false;
		this.frameY = 0
		this.timer = 0
		this.fps = 10

		this.interval = 1000 / this.fps // slow down the animation

		const image: HTMLImageElement = new Image()
		image.src = '/images/Fireball.png'
		image.onload = () => {
			this.image = image
		}

	}

	update(deltaTime: DOMHighResTimeStamp) {

		this.position.y += this.velocity.y

		if (this.timer > this.interval) {
			if (this.frameY < cFireball.maxFrame) { //frameY = 0,1,2,3
				this.frameY++
			}
			else this.frameY = 0
			this.timer = 0
		} else {
			this.timer += deltaTime
		}
		this.draw()

	}
	draw() {

		// nine arguments to drawImage: 1: image source, 2: source X, 3: source Y, 4: source width
		// 5: source height, 6: destination X, 7: destination Y, 8: destination width, 9: destination height
		if (this.image) {
			this.canvasContext.drawImage(this.image,
				0,
				this.frameY * cFireball.height,
				cFireball.width,
				cFireball.height,
				this.position.x - cFireball.width / 2,
				this.position.y,
				cFireball.width,
				cFireball.height)
		}
	}
}