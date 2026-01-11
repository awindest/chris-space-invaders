import { Particle } from '$components/Particle.svelte'
import type { ParticleType } from '$lib/types'
// create stars
export class Stars {
	constructor(canvasContext: CanvasRenderingContext2D, particles: ParticleType[]) {

		for (let i = 0; i < 1000; i++) {
			particles.push(
				new Particle(canvasContext, {
					position: {
						x: Math.random() * canvasContext.canvas.width,
						y: Math.random() * canvasContext.canvas.height
					},
					velocity: {
						x: 0,
						y: 2
					},
					radius: Math.random() * 2,
					color: 'white',
					fades: false
				})
			)
		}
	}
}

