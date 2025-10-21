<script lang="ts">
	import { onMount } from 'svelte'
	import { Stars } from '$components/Stars.svelte'
	import { InvaderGrid } from '$components/InvaderGrid.svelte'
	import { Missile } from '$components/Missile.svelte'
	import { Particle } from '$components/Particle.svelte'
	import { Player } from '$components/Player.svelte'
	import { InvaderSpriteSheet } from '$components/InvaderSpriteSheet.svelte'
	import { drawSplashScreen } from '$components/drawSplashScreen'
	import {
		initAudio,
		playIntroMusic,
		playExplosionSound,
		playInvaderWalk,
		playMissileSound
	} from '$components/SoundEffects'

	import AudioPlayer, { pauseAll } from '$components/AudioPlayer.svelte'
	import { tracks } from '$components/tracks.js'

	import { Invader, Spaceship } from '$lib/config.svelte' // game constants
	let frameCounter = 0 // controls animations

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
	let backgroundCanvas: HTMLCanvasElement = $state()
	let canvasContext: CanvasRenderingContext2D | null = $state()
	let backgroundContext: CanvasRenderingContext2D | null = $state()
	let player
	let stars
	let invaderSpriteSheet //: HTMLImageElement
	let invadersLogo
	// game state
	let game = {
		over: false,
		active: true
	}
	let frames = 0
	let randomInterval = Math.floor(Math.random() * 500 + 500)

	onMount(() => {
		// need canvas instantiated first
		canvasContext = canvas.getContext('2d')
		canvas.height = window.innerHeight
		canvas.width = window.innerWidth
		player = new Player(canvasContext, canvas.width, canvas.height)
		invaderSpriteSheet = new Image()
		// invaderSpriteSheet.src = '/images/InvaderSpriteSheet1280x960.png'
		invaderSpriteSheet.src = '/images/InvadersSpriteSheet.png'

		// backgroundContext = backgroundCanvas.getContext('2d')
		// backgroundCanvas.height = window.innerHeight
		// backgroundCanvas.width = window.innerWidth

		init()
	})
	// Initialize
	function init() {
		// createStars()
		// stars = new Stars(backgroundContext, backgroundCanvas.height, backgroundCanvas.width)
		// stars.draw()
		initAudio()
		// playIntroMusic()
		//drawSplashScreen(canvasContext, canvas, invaderSpriteSheet)
		animate()
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
		// sounds of the game
		if (!game.active) {
			playIntroMusic()
			console.log('playing bg music')
			return
		} else {
			playInvaderWalk()
		}
		frameCounter++

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
				playIntroMusic()
				// drawSplashScreen()
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

{#each tracks as track}
	<AudioPlayer {...track} />
{/each}

<canvas bind:this={canvas}> </canvas>

<div class="absolute h-full w-full overflow-hidden">
	<div
		class="absolute h-full w-full transition-all delay-500 duration-1000"
		class:opacity-0={!$finishedOnce}
	>
		<!-- <Canvas></Canvas> -->


	{#if !$finishedOnce}
		<div
			class="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center p-12 text-2xl text-white"
		>
			{($progress * 100).toFixed()} %
		</div>
	{:else if game.state === 'off'}
		<div
			class="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center p-12"
		>
			<button
				onclick={() => {
					game.sound.resume();
					game.state = 'intro';
				}}
				class="pointer-events-auto rounded-full bg-white px-6 py-3 text-2xl text-black flex items-center justify-center"
			>
				Insert Coin
				<img src={coin} class="p-1" height="40" width="40" alt="a quarter" />
			</button>
		</div>
	{/if}

	<div class="absolute right-6 top-6">
		<button
			class="rounded-full bg-white p-2 [&>*]:h-7 [&>*]:w-7"
			onclick={() => (game.muted = !game.muted)}
		>
			{#if game.muted}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="192"
					height="192"
					fill="#000000"
					viewBox="0 0 256 256"
				>
					<rect width="256" height="256" fill="none" /><path
						d="M80,168H32a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H80l72-56V224Z"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
					<line
						x1="240"
						y1="104"
						x2="192"
						y2="152"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
					<line
						x1="240"
						y1="152"
						x2="192"
						y2="104"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="192"
					height="192"
					fill="#000000"
					viewBox="0 0 256 256"
					><rect width="256" height="256" fill="none" /><path
						d="M80,168H32a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H80l72-56V224Z"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/><line
						x1="192"
						y1="104"
						x2="192"
						y2="152"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/><line
						x1="224"
						y1="88"
						x2="224"
						y2="168"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/></svg
				>
			{/if}
		</button>
	</div>
</div>

<style>
	#backgroundCanvas {
		z-index: 0;
	}
	#foregroundCanvas {
		z-index: 1;
	}
</style>
