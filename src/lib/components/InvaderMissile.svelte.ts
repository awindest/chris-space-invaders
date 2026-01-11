import { cInvader, cInvaderMissile } from '$lib/config.svelte'
import type { PositionType, VelocityType } from '$lib/types'

export class InvaderMissile {
	canvasContext: CanvasRenderingContext2D
	invadersSpriteSheet: HTMLImageElement
	frameX: number
	position: PositionType
	velocity: VelocityType
	timer: number
	fps: number
	interval: number
	constructor(canvasContext: CanvasRenderingContext2D,
		invadersSpriteSheet: HTMLImageElement,
		frameX: number,
		{ position, velocity }: { position: PositionType; velocity: VelocityType }) {

		this.canvasContext = canvasContext
		this.invadersSpriteSheet = invadersSpriteSheet
		this.position = position
		this.velocity = velocity
		this.frameX = frameX
		this.timer = 0
		this.fps = 30

		this.interval = 1000 / this.fps // slow down the animation

		// replaced with cInvaderMissile.maxFrame -> this.maxFrame = 4 // four sprites for Invader Missile


	}
	draw(): void {

		// nine arguments to drawImage: 1: image source, 2: source X, 3: source Y, 4: source width
		// 5: source height, 6: destination X, 7: destination Y, 8: destination width, 9: destination height
		this.canvasContext.drawImage(this.invadersSpriteSheet,
			cInvaderMissile.spritePositionX + this.frameX * cInvaderMissile.width,
			cInvaderMissile.spritePositionY,
			cInvaderMissile.width,
			cInvaderMissile.height,
			this.position.x - cInvader.width / 3,
			this.position.y,
			cInvaderMissile.width,
			cInvaderMissile.height)
	}
	update(deltaTime: DOMHighResTimeStamp): void {

		if (this.timer > this.interval) {

			if (this.frameX < cInvaderMissile.maxFrame) this.frameX++ //?? this.frameX %= cInvader.maxFrame
			else this.frameX = 0

			this.timer = 0 // reset timer

		} else {
			this.timer += deltaTime
		}
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

	}
}
