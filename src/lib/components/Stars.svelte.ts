import { Particle } from '$components/Particle.svelte'
// create stars
export class Stars {

	constructor(canvasContext, canvasWidth, canvasHeight) {
		const particles = []
		for (let i = 0; i < 100; i++) {
			particles.push(
				new Particle(canvasContext, {
					position: {
						x: Math.random() * canvasWidth,
						y: Math.random() * canvasHeight
					},
					velocity: {
						x: 0,
						y: 1
					},
					radius: Math.random() * 2,
					color: 'white',
					fades: false
				})
			)
		}
	}
}

