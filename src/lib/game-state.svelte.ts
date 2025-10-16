import { getContext, setContext } from 'svelte';
import type { Game } from './types';

export class GameState {
	// ctx = $state()
	// height = $state()
	// width = $state()
	// level = $state(0)
	// toastToTimeoutMap = new Map<string, number>();
	gameState = $state<Game>();

	constructor() {

		console.log('in game-state constructor', gameState)
		// onDestroy(() => {
		// 	for (const timeout of this.toastToTimeoutMap.values()) {
		// 		clearTimeout(timeout);
		// 	}
		// 	this.toastToTimeoutMap.clear();
		// });
	}
	// initialize Game State with context and canvas
	setCanvasState(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		this.gameState = {
			ctx: ctx,
			canvasHeight: canvas.height,
			canvasWidth: canvas.width,
			gameState: "active",
			level: 0
		}
		// this.gameState.height = canvas.height
		// this.gameState.width = canvas.width
		// this.gameState.ctx = ctx
	}
	// set GameState
	setGameState(gameState) {
		this.gameState.gameState = gameState
	}
	// set the game level
	setLevel(level: number) {
		this.gameState.level = level
	}
}

const GAME_KEY = Symbol('SPACEINVADERS');

export function setGameState() {
	return setContext(GAME_KEY, new GameState());
}

export function getGameState() {
	return getContext<ReturnType<typeof setGameState>>(GAME_KEY);
}
