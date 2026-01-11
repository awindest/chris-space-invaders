type GameStates = 'insertCoin' | 'intro' | 'playing' | 'gameOver'
type GameEvents = 'start' | 'play' | 'endGame'
// insertCoin state shows buttons and Invaders logo
// intro state shows Invaders logo, Invader points and flashing 'Press Spacebar to start'
// when logo and scoring screen are visible - user hits space bar to start playing
// playing state is self explanatory
// gameOver state is end state - screen freezes with game over overlay screen
// this logic is too complicated. Don't think we need events just change the states via context API
function gameReducer(state: GameStates, event: GameEvents): GameStates {
	switch (state) {
		case 'insertCoin': // click the insert coin button; only appears once
			if (event === 'start') return 'intro'
			break
		case 'intro': // display scoring screen; spacebar launches game
			if (event === 'play') return 'playing'
			break
		case 'playing': // look for end of Game event; 'blowed up, sir!'
			if (event === 'endGame') return 'gameOver'
			break
		case 'gameOver': // display game over screen; spacebar shows splash screen
			if (event === 'start') return 'intro'
			break
	}
	return state // Return current state if no valid transition
}

let currentState = $state<GameStates>('insertCoin') // initial state
export function sendEvent(event: GameEvents) {
	currentState = gameReducer(currentState, event)
}
export function getGameState() {
	return currentState
}
