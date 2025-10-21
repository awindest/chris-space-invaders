import { drawBitmapFromSpriteSheet } from './drawBitmap'
import { Invader } from '$lib/config.svelte'
import type { InvaderSpriteSheet } from './InvaderSpriteSheet.svelte'


export class InvaderMissile {
	canvasContext
	invaderSpriteSheet

	constructor(canvasContext, frameCounter, invaderSpriteSheet, { position, velocity }) {
		this.canvasContext = canvasContext
		this.position = position
		this.velocity = velocity
		this.frameCounter = frameCounter
		this.invaderSpriteSheet = invaderSpriteSheet
		this.width = 3
		this.height = 10
		console.log('Frame Counter: ', frameCounter)
	}
	draw() {
		this.canvasContext.fillStyle = 'white'
		this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
		console.log(this.frameCounter)
		// drawBitmapFromSpriteSheet(this.canvasContext,
		// 	2,
		// 	0 + Math.floor(this.frameCounter / 4) % 4,
		// 	1,
		// 	Invader.width,
		// 	Invader.height,
		// 	this.invaderSpriteSheet,
		// 	this.position.x - Invader.width / 2,
		// 	this.position.y,
		// 	0, 0)
	}
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}
