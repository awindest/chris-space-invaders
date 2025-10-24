type GameStates = 'insertCoin' | 'intro' | 'playing' | 'gameOver'
type GameEvents = 'start' | 'play' | 'endGame'

function gameReducer(state: GameStates, event: GameEvents): GameStates {
	switch (state) {
		case 'insertCoin': // click the insert coin button; only appears once
			if (event === 'start') return 'intro'
			break
		case 'intro': // display splash screen; spacebar launches game
			if (event === 'play') return 'playing'
		case 'playing': // look for end of Game event; 'blowed up, sir!'
			if (event === 'endGame') return 'gameOver'
			break
		case 'gameOver': // display game over screen; spacebar shows splash screen
			if (event === 'start') return 'intro'
			break
	}
	return state // Return current state if no valid transition
}

let currentState = $state<GameStates>('insertCoin')

export function sendEvent(event: GameEvents) {
	currentState = gameReducer(currentState, event)
}
export function getGameState() {
	return currentState
}

//< !-- < button on: click = {() => sendEvent('start')}> Start Game </button> -->
