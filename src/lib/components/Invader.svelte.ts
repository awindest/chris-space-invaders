import { cInvader, cInvaderColors } from '$lib/config.svelte'
import { InvaderMissile } from '$components/InvaderMissile.svelte'
import type { InvaderMissileType, PositionType, VelocityType } from '$lib/types'
export class Invader {
	canvasContext: CanvasRenderingContext2D
	invadersSpriteSheet: HTMLImageElement
	spriteRow: number
	position: PositionType
	velocity: VelocityType
	frameX: number
	width: number
	height: number
	timer: number
	fps: number
	interval: number
	color: string
	constructor(canvasContext: CanvasRenderingContext2D,
		invadersSpriteSheet: HTMLImageElement,
		spriteRow: number,
		position: PositionType) {
		this.canvasContext = canvasContext
		this.invadersSpriteSheet = invadersSpriteSheet
		this.spriteRow = spriteRow // determines the Invader type (there are three)
		this.position = {
			x: position.x,
			y: position.y
		}
		this.velocity = {
			x: 3,
			y: 0
		}
		this.width = cInvader.width // need these properties on the class as we call
		this.height = cInvader.height // particles and pass an object to them.
		this.frameX = 0
		this.timer = 0
		this.fps = 10

		this.interval = 5000 / this.fps // slow down the animation
		// need to add level logic; get level from Context API and use colorPerLevel object
		this.color = cInvaderColors[this.spriteRow - 1]

	}

	draw(): void {
		// nine arguments to drawImage: 1: image source, 2: source X, 3: source Y, 4: source width
		// 5: source height, 6: destination X, 7: destination Y, 8: destination width, 9: destination height
		this.canvasContext.drawImage(this.invadersSpriteSheet,
			cInvader.spritePositionX + this.width * this.frameX,
			cInvader.spritePositionY + this.height * (this.spriteRow - 1),
			cInvader.width,
			cInvader.height,
			this.position.x,
			this.position.y,
			cInvader.width,
			cInvader.height)

	}
	update(deltaTime: DOMHighResTimeStamp, { velocity }: { velocity: VelocityType }): void {
		// console.log('frame 1: ', this.frameX, this.timer, this.interval, deltaTime, velocity)
		if (this.timer > this.interval) {

			if (this.frameX < cInvader.maxFrame) {
				this.frameX++ //?? console.log(this.frameX %= cInvader.maxFrame
			}
			else this.frameX = 0

			this.timer = 0 // reset timer

		} else {
			this.timer += deltaTime

		}
		// console.log(' in invader: ', velocity) okay
		this.draw()
		this.position.x += velocity.x // input velocities
		this.position.y += velocity.y
	}

	shoot(invaderMissiles: InvaderMissileType[]): void {
		invaderMissiles.push(
			new InvaderMissile(this.canvasContext, this.invadersSpriteSheet, this.frameX, {
				position: {
					x: this.position.x - this.width / 2,
					y: this.position.y + this.height
				},
				velocity: {
					x: 0,
					y: 4
				}
			})
		)
	}
}
// when killed, show score
// { #if blownup }
// <div transition: fade = {{ duration: 750 }}> { score } </div>
// {/if }
// function colorDistance(r1: number, g1, b1, r2, g2, b2) {
// 	return Math.sqrt(
// 		(r1 - r2) ** 2 +
// 		(g1 - g2) ** 2 +
// 		(b1 - b2) ** 2
// 	)
// }

// function rgbToHex(r, g, b) {
// 	return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
// }

// function hexToRgb(hex:number) {

// 	const bigint = parseInt(hex.slice(1), 16)

// 	return {

// 		r: (bigint >> 16) & 255,
// 		g: (bigint >> 8) & 255,
// 		b: bigint & 255
// 	}

// }
