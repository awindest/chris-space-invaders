<script lang="ts">
	import type { GlobalGameStateType } from '$lib/types'
	import { setContext } from 'svelte'
	import Canvas from '$components/Canvas.svelte'

	// this sets a number of parameters and provides a svelte context to retrieve them
	// canvas context, canvas height and width, game status,game level or wave and whether
	// or not to play audio.

	let globalGameState = $state<GlobalGameStateType>({
		canvasContext: undefined,
		canvasHeight: 0,
		canvasWidth: 0,
		gameState: 'insertCoin',
		wave: 0,
		okToPlaySound: false
	})
	setContext('GlobalGameState', globalGameState)
</script>

<Canvas></Canvas>
