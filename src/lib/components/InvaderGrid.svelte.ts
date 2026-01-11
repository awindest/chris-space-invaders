import { cInvader, cInvaderGrid } from '$lib/config.svelte'

import { Invader } from '$components/Invader.svelte'
import type { InvaderType, PositionType, VelocityType } from '$lib/types'

export class InvaderGrid {
	canvasContext: CanvasRenderingContext2D
	invadersSpriteSheet: HTMLImageElement
	canvasWidth: number

	invaderPattern: number[]
	position: PositionType
	velocity: VelocityType
	invaders: InvaderType[]
	width: number

	constructor(canvasContext: CanvasRenderingContext2D, invadersSpriteSheet: HTMLImageElement) {

		this.canvasContext = canvasContext
		this.invadersSpriteSheet = invadersSpriteSheet
		this.canvasWidth = canvasContext.canvas.width
		this.invaderPattern = [1, 2, 2, 3, 3]
		this.position = { // initial offset of grid in pixels
			x: 10,
			y: 15
		}

		this.velocity = { // move across screen
			x: 2, // 3,
			y: 0
		}
		this.invaders = []
		this.width = cInvaderGrid.columns * cInvader.width
		const xSeparation = 1.1
		const ySeparation = 1.2
		for (let x = 0; x < cInvaderGrid.columns; x++) {
			for (let y = 0; y < cInvaderGrid.rows; y++) {
				this.invaders.push(
					new Invader(
						this.canvasContext,
						this.invadersSpriteSheet,
						this.invaderPattern[y], {
						x: x * cInvader.width * xSeparation + this.position.x,
						y: y * cInvader.height * ySeparation + this.position.y
					}

					)
				)
			}
		}

	}
	update(): void {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0 //turn off; otherwise the grid would go off screen

		if (this.position.x + this.width >= this.canvasWidth || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x //* 1.15 // increase velocity as we move closer to player
			this.velocity.y = cInvader.height // move down a row after hitting the edge.
		}
	}
}
