import { getContext, setContext } from 'svelte';
import type { GlobalGameStateType } from '$lib/types';

const GAME_KEY = Symbol('SPACE_INVADERS');

export function setGameStateContext(globalGameState: GlobalGameStateType) {
	return setContext(GAME_KEY, globalGameState)
}

export function getGameStateContext() {
	return getContext<ReturnType<typeof setGameStateContext>>(GAME_KEY);
}

