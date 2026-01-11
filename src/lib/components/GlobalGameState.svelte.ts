import { getContext, setContext } from 'svelte';
import type { GlobalGameStateType } from '$lib/types';

// this sets a number of parameters and provides a svelte context to retrieve them
// canvas context, canvas height and width, game level or wave.

let globalGameState = $state<GlobalGameStateType>({
	canvasContext: null,
	canvasHeight: 0,
	canvasWidth: 0,
	gameState: "insertCoin",
	wave: 0,
	okToPlaySound: false
})

// initialize GlobalGameState with canvas context and initial conditions

console.log('In Game: ', this.globalGameState)
	}
reset(canvasContext: CanvasRenderingContext2D) {
	this.globalGameState = {
		canvasContext: canvasContext,
		canvasHeight: canvasContext.canvas.height,
		canvasWidth: canvasContext.canvas.width,
		gameState: "insertCoin",
		level: 0,
		okToPlaySound: false
	}
}
// handle window resize event
// resize(canvasContext: CanvasRenderingContext2D) {
// 	this.globalGameState = {
// 		canvasContext: canvasContext,
// 		canvasHeight: canvasContext.canvas.height,
// 		canvasWidth: canvasContext.canvas.width
// 	}
// }

// set GameState
// setGameState(gameState: GlobalGameStateType) {
// 	this.globalGameState.gameState = gameState
// }
// set the game level
// setGameLevel(level: number) {
// 	this.globalGameState.level = level
// }
// }

const GAME_KEY = Symbol('SPACE_INVADERS');

export function setGameStateContext(globalGameState: GlobalGameStateType) {
	return setContext(GAME_KEY, globalGameState)
}

export function getGameStateContext() {
	return getContext<ReturnType<typeof setGameStateContext>>(GAME_KEY);
}

