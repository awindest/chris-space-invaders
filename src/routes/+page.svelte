<script lang="ts">
	import { onMount } from 'svelte'
	import { InvaderGrid } from '$components/InvaderGrid.svelte'
	import { Missile } from '$components/Missile.svelte'
	import { Particle } from '$components/Particle.svelte'
	import { Player } from '$components/Player.svelte'
	import { InvaderSpriteSheet } from '$components/InvaderSpriteSheet.svelte'
	import { drawSplashScreen } from '$components/drawSplashScreen.ts'
	import {
		initAudio,
		playIntroMusic,
		playExplosionSound,
		playInvaderWalk,
		playMissileSound
	} from '$components/SoundEffects'

	// object to manage key states
	const keys = {
		a: {
			pressed: false
		},
		d: {
			pressed: false
		},
		space: {
			pressed: false
		}
	}
	const dunnoFactor: number = 10
	const missiles = []
	const grids = []
	const invaderMissiles = []
	const particles = [] // particles are used for background stars, exploding invaders and the player

	let canvas: HTMLCanvasElement = $state()
	let canvasContext: CanvasRenderingContext2D | null = $state()
	let player
	let invaderSpriteSheet //: HTMLImageElement
	let invadersLogo
	// game state
	let game = {
		over: false,
		active: true
	}
	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)
	// let myFont = new FontFace('myFont', 'url(/fonts/beefd.ttf)')

	// myFont.load().then(function (font) {
	// 	// with canvas, if this is ommited won't work
	// 	document.fonts.add(font)
	// 	console.log('Font loaded')
	// })
	onMount(() => {
		// need canvas instantiated first
		canvasContext = canvas.getContext('2d')
		canvas.height = window.innerHeight
		canvas.width = window.innerWidth
		player = new Player(canvasContext, canvas.width, canvas.height)
		invaderSpriteSheet = new Image()
		// invaderSpriteSheet.src = '/images/InvaderSpriteSheet1280x960.png'
		invaderSpriteSheet.src = '/images/InvadersSpriteSheet.png'

		init()
		// animate()
	})
	// Initialize
	function init() {
		createStars()
		initAudio()
		// playIntroMusic()
		drawSplashScreen(canvasContext, canvas, invaderSpriteSheet)
	}
	// create stars
	function createStars() {
		for (let i = 0; i < 100; i++) {
			particles.push(
				new Particle(canvasContext, {
					position: {
						x: Math.random() * canvas.width,
						y: Math.random() * canvas.height
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

	// particles explode and fade out
	function createParticles(canvasContext, { object, color, fades }) {
		for (let i = 0; i < 25; i++) {
			particles.push(
				new Particle(canvasContext, {
					position: {
						x: object.position.x + object.width / 2,
						y: object.position.y + object.height / 2
					},
					velocity: {
						x: (Math.random() - 0.5) * 2,
						y: (Math.random() - 0.5) * 2
					},
					radius: Math.random() * 3,
					color: color || '#BAA0DE',
					fades: fades
				})
			)
		}
	} // end of create particles

	function animate() {
		if (!game.active) {
			playIntroMusic()
			console.log('playing bg music')
			return
		}

		// self callback, typical pattern
		requestAnimationFrame(animate)

		canvasContext.fillStyle = 'black' // always black
		canvasContext.fillRect(0, 0, canvas.width, canvas.height)

		player.update()

		particles.forEach((particle, i) => {
			if (particle.position.y - particle.radius >= canvas.height) {
				particle.position.x = Math.random() * canvas.width
				particle.position.y = -particle.radius
			}
			if (particle.opacity <= 0) {
				setTimeout(() => {
					particles.splice(i, 1)
				}, 0)
			} else {
				particle.update()
			}
		})
		// enemy weapons
		invaderMissiles.forEach((invaderMissile, index) => {
			if (invaderMissile.position.y + invaderMissile.height >= canvas.height) {
				setTimeout(() => {
					invaderMissiles.splice(index, 1)
				}, 0)
			} else {
				invaderMissile.update()
			}
			// Missile hits player
			if (
				invaderMissile.position.y + invaderMissile.height >= player.position.y &&
				invaderMissile.position.x + invaderMissile.width >= player.position.x &&
				invaderMissile.position.x <= player.position.x + player.width
			) {
				setTimeout(() => {
					invaderMissiles.splice(index, 1)
					player.opacity = 0
					game.over = true
				}, 0)

				setTimeout(() => {
					game.active = false
				}, 2000)

				createParticles(canvasContext, {
					object: player,
					color: 'white',
					fades: true
				})
				playExplosionSound()
			}
		})
		// player weapons
		missiles.forEach((missile, index) => {
			if (missile.position.y + missile.radius <= 0) {
				setTimeout(() => {
					missiles.splice(index, 1)
				}, 0)
			} else {
				missile.update()
			}
		})

		grids.forEach((grid, gridIndex) => {
			grid.update()
			// spawn Missiles
			if (frames % 100 === 0 && grid.invaders.length > 0) {
				grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderMissiles)
			}
			grid.invaders.forEach((invader, i) => {
				invader.update({ velocity: grid.velocity })

				//Missiles hit enemy
				missiles.forEach((missile, j) => {
					if (
						missile.position.y - missile.radius <= invader.position.y + Invader.height &&
						missile.position.x + missile.radius >= invader.position.x &&
						missile.position.x - missile.radius <= invader.position.x + Invader.width &&
						missile.position.y + missile.radius >= invader.position.y
					) {
						setTimeout(() => {
							const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
							const missileFound = missiles.find((missile2) => missile2 === missile)
							// remove invader and Missile
							if (invaderFound && missileFound) {
								createParticles(canvasContext, {
									object: invader,
									fades: true
								})
								grid.invaders.splice(i, 1)
								missiles.splice(j, 1)

								if (grid.invaders.length > 0) {
									const firstInvader = grid.invaders[0]
									const lastInvader = grid.invaders[grid.invaders.length - 1]

									grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
									grid.position.x = firstInvader.position.x
								}
							}
						}, 0)
					}
				})
			})
		})
		// handle key presses
		if (keys.a.pressed && player.position.x >= 0) {
			player.velocity.x = -7
			player.rotation = 0.15
		} else if (keys.d.pressed && player.position.x + player.width + dunnoFactor <= canvas.width) {
			player.velocity.x = 7
			player.rotation = -0.15
		} else {
			player.velocity.x = 0
			player.rotation = 0
		}

		// spawning enemies
		if (frames % randomInterval === 0) {
			grids.push(new InvaderGrid(canvasContext, canvas.width))
			randomInterval = Math.floor(Math.random() * 500 + 500)
			frames = 0
		}

		frames++
	} // end of animate

	function handleKeydown(event: KeyboardEvent) {
		if (game.over) return
		switch (event.key) {
			case 'a':
				keys.a.pressed = true
				break
			case 'd':
				keys.d.pressed = true
				break
			case ' ':
				missiles.push(
					new Missile(canvasContext, {
						position: {
							x: player.position.x + player.width / 2,
							y: player.position.y
						},
						velocity: {
							x: 0,
							y: -10
						}
					})
				)
				playMissileSound()
				break
		}
	} // end of event listener
	function handleKeyup(event: KeyboardEvent) {
		switch (event.key) {
			case 'a':
				keys.a.pressed = false
				break
			case 'd':
				keys.d.pressed = false
				break
			case ' ':
				break
		}
	} // end of event listener
</script>

<svelte:window onkeydown={handleKeydown} onkeyup={handleKeyup} />

<canvas bind:this={canvas}> </canvas>
<button onclick={playIntroMusic} />
