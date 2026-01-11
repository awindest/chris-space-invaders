<script lang="ts">
	let { children } = $props()

	import { cInvader, cInvaderMissile, cFireball } from '$lib/config.svelte' // game constants
	import { onMount, onDestroy, setContext } from 'svelte'
	import MuteButton from '$components/MuteButton.svelte'
	import InsertCoinButton from '$components/InsertCoinButton.svelte'
	import { Stars } from '$components/Stars.svelte'
	import { InvaderGrid } from '$components/InvaderGrid.svelte'
	import { createParticles } from '$components/createParticles'
	import { Player } from '$components/Player.svelte'
	import { SplashScreen } from '$components/SplashScreen.svelte'
	import {
		initAudio,
		playIntroMusic,
		pauseIntroMusic,
		playExplosionSound,
		playInvaderWalk,
		playMissileSound
	} from '$components/SoundEffects'
	import { sendEvent, getGameState } from '$components/StateMachine.svelte'

	import AudioPlayer, { pauseAll } from '$components/AudioPlayer.svelte'
	import { tracks } from '$components/tracks.js'

	// import { InvaderMissile } from '$components/InvaderMissile.svelte'
	import type {
		InvaderGridType,
		PlayerType,
		InvaderMissileType,
		ParticleType,
		FireballType,
		SplashScreenType
	} from '$lib/types'
	// import { Fireball } from './Fireball.svelte'
	let frame: number = 0 // controls animations
	let level = 0

	let drewScoringScreen: number | NodeJS.Timeout = 0 // initial state
	const okToPlaySound = $state({ state: false }) // start off muted
	setContext('mute-button-state', okToPlaySound)

	// object to manage key states
	const keys = {
		ArrowLeft: {
			pressed: false
		},
		ArrowRight: {
			pressed: false
		},
		space: {
			pressed: false
		}
	}
	const dunnoFactor: number = 10
	let invaderGrid: InvaderGridType
	const invaderMissiles: InvaderMissileType[] = []
	let particles = $state<ParticleType[]>([]) // particles are used for background stars, exploding invaders and the player

	let canvas = $state<HTMLCanvasElement>() //| null = null
	let canvasContext = $state<CanvasRenderingContext2D>() //| undefined //null = null //= $state()

	let player: PlayerType
	const fireballs: FireballType[] = []

	let stars
	let splashScreen: SplashScreenType
	let invadersSpriteSheet: HTMLImageElement
	let scoringScreenVisible: boolean = false
	let requestAnimationId: number

	$effect(() => {
		// need canvas instantiated first
		if (!canvasContext) canvasContext = <CanvasRenderingContext2D>canvas!.getContext('2d')

		if (!canvasContext || !(canvasContext instanceof CanvasRenderingContext2D)) {
			throw new Error('Failed to get 2D context')
		}
		function resize() {
			canvas!.height = window.innerHeight
			canvas!.width = window.innerWidth
			if (splashScreen) {
				splashScreen.drawSplashScreen()
			}
		}
		window.addEventListener('resize', resize)

		resize()

		player = new Player(canvasContext)
		// invadersSpriteSheet = new InvadersSpriteSheet()
		invadersSpriteSheet = new Image()

		invadersSpriteSheet.src = '/images/InvadersSpriteSheetFig.png'

		invadersSpriteSheet.onload = () => {
			splashScreen = new SplashScreen(canvasContext, invadersSpriteSheet)

			initializeGame()
		}
		return () => {
			window.removeEventListener('resize', resize)
		}
	})
	onDestroy(() => {
		if (requestAnimationId) {
			cancelAnimationFrame(requestAnimationId)
		}
	})

	// Initialize
	function initializeGame() {
		// createStars()
		stars = new Stars(canvasContext, particles)
		// splashScreen = new SplashScreen(canvasContext, invadersSpriteSheet)
		initAudio()
		if (okToPlaySound.state === true) playIntroMusic()
		animate(0)
	}

	let lastTime: DOMHighResTimeStamp = 0

	function animate(timestamp: DOMHighResTimeStamp) {
		const deltaTime: DOMHighResTimeStamp = timestamp - lastTime
		lastTime = timestamp
		// console.log(timestamp, deltaTime, lastTime) //okay
		let gameState = getGameState()

		if (gameState === 'intro' && scoringScreenVisible === false) {
			// sendEvent('play') this is sent when space bar is pressed
			// no need to draw it again
			console.log('drawing scoring screen', drewScoringScreen)
			drewScoringScreen = splashScreen.drawScoringScreen()
			scoringScreenVisible = true
		}
		if (gameState === 'playing') {
			// sounds of the game

			if (okToPlaySound.state === true) {
				pauseIntroMusic()
				playInvaderWalk()
			}

			canvasContext.fillStyle = 'black' // always black
			canvasContext.fillRect(0, 0, canvas.width, canvas.height)

			player.update()
			// stars, exploding invaders, exploding spaceship and exploding player are all particles
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
			// need to change this logic as we want only one grid per level
			if (level === 0) {
				invaderGrid = new InvaderGrid(canvasContext, invadersSpriteSheet)
				level = 1
			}
			// enemy weapons
			invaderMissiles.forEach((invaderMissile: InvaderMissileType, index: number) => {
				if (invaderMissile.position.y + cInvaderMissile.height >= canvas.height) {
					setTimeout(() => {
						invaderMissiles.splice(index, 1)
					}, 0)
				} else {
					invaderMissile.update(deltaTime)
				}
				// Missile hits player
				if (
					invaderMissile.position.y + cInvaderMissile.height >= player.position.y &&
					invaderMissile.position.x + cInvaderMissile.width >= player.position.x &&
					invaderMissile.position.x <= player.position.x + player.width
				) {
					// player hit
					setTimeout(() => {
						invaderMissiles.splice(index, 1)
						player.opacity = 0
					}, 0)

					setTimeout(() => {
						sendEvent('endGame')
					}, 2000)

					createParticles(canvasContext, particles, {
						object: player,
						color: 'red',
						fades: true
					})
					if (okToPlaySound.state === true) {
						playExplosionSound()
						playIntroMusic()
					}
				}
			})

			// player weapons

			fireballs.forEach((fireball, index) => {
				if (fireball.position.y + cFireball.height <= 0) {
					setTimeout(() => {
						fireballs.splice(index, 1) // prevents flashing
					}, 0)
				} else {
					fireball.update(deltaTime)
				}
			})
			if (invaderGrid) {
				invaderGrid.update()
				// spawn Missiles
				if (frame % 100 === 0 && invaderGrid.invaders.length > 0) {
					invaderGrid.invaders[Math.floor(Math.random() * invaderGrid.invaders.length)].shoot(
						invaderMissiles
					)
				}
				invaderGrid.invaders.forEach((invader, i) => {
					invader.update(deltaTime, { velocity: invaderGrid.velocity })

					// Fireballs hit enemy
					fireballs.forEach((fireball, j) => {
						if (
							fireball.position.y - cFireball.height <= invader.position.y + cInvader.height &&
							fireball.position.x + cFireball.width >= invader.position.x &&
							fireball.position.x - cFireball.width <= invader.position.x + cInvader.width &&
							fireball.position.y + cFireball.height >= invader.position.y
						) {
							setTimeout(() => {
								const invaderFound = invaderGrid.invaders.find((invader2) => invader2 === invader)
								const fireballFound = fireballs.find((fireball2) => fireball2 === fireball)
								// remove invader and Missile
								if (invaderFound && fireballFound) {
									createParticles(canvasContext, particles, {
										object: invader,
										color: invader.color,
										fades: true
									})
									invaderGrid.invaders.splice(i, 1)
									fireballs.splice(j, 1)

									if (invaderGrid.invaders.length > 0) {
										const firstInvader = invaderGrid.invaders[0]
										const lastInvader = invaderGrid.invaders[invaderGrid.invaders.length - 1]

										invaderGrid.width =
											lastInvader.position.x - firstInvader.position.x + lastInvader.width
										invaderGrid.position.x = firstInvader.position.x
									}
								}
							}, 0)
						}
					})
				})
			}
			// handle key presses
			if (keys.ArrowLeft.pressed && player.position.x >= 0) {
				player.velocity.x = -7
				player.rotation = 0.15
			} else if (
				keys.ArrowRight.pressed &&
				player.position.x + player.width + dunnoFactor <= canvas.width
			) {
				player.velocity.x = 7
				player.rotation = -0.15
			} else {
				player.velocity.x = 0
				player.rotation = 0
			}

			frame++
		}
		// self callback, typical pattern
		requestAnimationId = requestAnimationFrame(animate)
	} // end of animate

	function handleKeydown(event: KeyboardEvent) {
		event.preventDefault() // disable space bar
		const gameState = getGameState()
		if (gameState === 'gameOver') return

		if (gameState === 'intro' && event.key === ' ') {
			// we are playing the game
			console.log('Should be intro; ', gameState)
			sendEvent('play')
			clearInterval(drewScoringScreen) // clean up SetInterval
		} else if (gameState === 'playing') {
			switch (event.key) {
				case 'ArrowLeft':
					keys.ArrowLeft.pressed = true
					break
				case 'ArrowRight':
					keys.ArrowRight.pressed = true
					break
				case 'q':
					sendEvent('endGame')
					break
				case ' ': // player fires missle
					player.shoot(fireballs)

					if (okToPlaySound.state === true) playMissileSound()

					break
				default:
			}
		}
	} // end of handleKeydown event listener

	function handleKeyup(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = false
				break
			case 'ArrowRight':
				keys.ArrowRight.pressed = false
				break
			case ' ':
				break
		}
	} // end of handleKeyup event listener

	const handleResize = () => {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		const { top, left } = canvas.getBoundingClientRect()
	}
</script>

<svelte:window onkeydown={handleKeydown} onkeyup={handleKeyup} />
<!-- onresize={handleResize} /> -->

<!-- {#each tracks as track}
	<AudioPlayer {...track} />
{/each} -->
<div class="absolute h-full w-full overflow-hidden">
	{#if getGameState() === 'insertCoin'}
		<InsertCoinButton />
	{/if}
	<MuteButton />
</div>

<canvas bind:this={canvas}>
	<!-- {#if canvasContext}
		<Player bind:this={player} {canvasContext} />
		<InvaderGrid bind:this={invaderGrid} />

	{/if} -->
	{@render children?.()}
</canvas>
