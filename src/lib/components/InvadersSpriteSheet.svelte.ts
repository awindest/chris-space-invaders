/*
Design: 
Load spritesheet
Get the aliens (alien1 ... alien5)
Get the invader missile sprites
Get the spaceship sprites
*/
export class InvadersSpriteSheet {
	invadersSpriteSheet: HTMLImageElement

	constructor() {
		this.invadersSpriteSheet = new Image();
		this.invadersSpriteSheet.src = "/images/InvadersSpriteSheet.png";
		this.invadersSpriteSheet.onload = () => {
			return this
		}
	}
}
