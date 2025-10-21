import { Particle } from '$components/Particle.svelte'
// create stars
export class Stars {
	backgroundContext
	canvasWidth
	canvasHeight
	particles = []
	constructor(backgroundContext, canvasWidth, canvasHeight) {
		// const particles = []
		this.particles = []
		this.backgroundContext = backgroundContext
		this.canvasWidth = canvasWidth
		this.canvasHeight = canvasHeight

		for (let i = 0; i < 100; i++) {
			this.particles.push(
				new Particle(backgroundContext, {
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

	draw() {
		this.backgroundContext.fillStyle = 'black' // always black
		this.backgroundContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight)


		this.particles.forEach((particle, i) => {
			if (particle.position.y - particle.radius >= this.canvasHeight) {
				particle.position.x = Math.random() * this.canvasWidth
				particle.position.y = -particle.radius
			}

			particle.update()
		}
		)
		// requestAnimationFrame(this.animate)

	}
}

