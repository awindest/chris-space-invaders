import { InvaderMissile } from '$components/InvaderMissile.svelte'
/*
Design: 
Load spritesheet
Get the aliens (alien1 ... alien5)
Get the invader missile sprites
Get the spaceship sprites
*/
export class InvaderSpriteSheet {
	constructor() {
		this.invaderSpriteSheet = new Image();
		this.invaderSpriteSheet.src = "/images/InvadersSpriteSheet.png";

		// return this.invaderSpriteSheet
	}
}
