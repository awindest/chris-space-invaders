import { drawBitmapFromSpriteSheet } from "./drawBitmap"
import { Invader, Spaceship } from '$lib/config.svelte' // game constants

export function drawSplashScreen(canvasContext, canvas, invaderSpriteSheet) {
    const yOffset = 150
    const xInvaderOffset = 90
    const xTextOffset = 40
    const invadersLogo: HTMLImageElement = new Image()
    invadersLogo.src = '/images/invadersLogo.jpeg'

    // if (state === GAME_STATE.START) {

    invadersLogo.onload = () => {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        console.log(invadersLogo)
        canvasContext.drawImage(invadersLogo, canvas.width / 2 - (0.9 * invadersLogo.width) / 2, 4)

        canvasContext.font = '20px beefd' // pre-loaded in header so they show up correctly
        canvasContext.fillStyle = '#F4FFBF'
        canvasContext.fillText('= 50 PTS', canvas.width / 2 - xTextOffset, canvas.height / 2 + yOffset + 0)
        canvasContext.fillText('= 40 PTS', canvas.width / 2 - xTextOffset, canvas.height / 2 + yOffset + 25)
        canvasContext.fillText('= 30 PTS', canvas.width / 2 - xTextOffset, canvas.height / 2 + yOffset + 50)
        canvasContext.fillText('= 20 PTS', canvas.width / 2 - xTextOffset, canvas.height / 2 + yOffset + 75)
        canvasContext.fillText('= 10 PTS', canvas.width / 2 - xTextOffset, canvas.height / 2 + yOffset + 100)

        // canvasContext.fillStyle = '#608057'
        canvasContext.fillText('= ??? PTS', canvas.width / 2 - xTextOffset, canvas.height / 2 + yOffset + 125)

        drawBitmapFromSpriteSheet(canvasContext,
            0,
            1,
            1,
            Invader.width,
            Invader.height,
            invaderSpriteSheet,
            canvas.width / 2 - xInvaderOffset,
            canvas.height / 2 + 0 - 21 + yOffset
        )
        drawBitmapFromSpriteSheet(canvasContext,
            0,
            4,
            1,
            Invader.width,
            Invader.height,
            invaderSpriteSheet,
            canvas.width / 2 - xInvaderOffset,
            canvas.height / 2 + 25 - 21 + yOffset
        )
        drawBitmapFromSpriteSheet(canvasContext,
            0,
            2,
            1,
            Invader.width,
            Invader.height,
            invaderSpriteSheet,
            canvas.width / 2 - xInvaderOffset,
            canvas.height / 2 + 50 - 21 + yOffset
        )
        drawBitmapFromSpriteSheet(canvasContext,
            0,
            3,
            1,
            Invader.width,
            Invader.height,
            invaderSpriteSheet,
            canvas.width / 2 - xInvaderOffset,
            canvas.height / 2 + 75 - 21 + yOffset
        )
        drawBitmapFromSpriteSheet(canvasContext,
            0,
            0,
            1,
            Invader.width,
            Invader.height,
            invaderSpriteSheet,
            canvas.width / 2 - xInvaderOffset,
            canvas.height / 2 + 100 - 21 + yOffset
        )
        drawBitmapFromSpriteSheet(canvasContext,
            0,
            0,
            1,
            Spaceship.width,
            Spaceship.height,
            invaderSpriteSheet,
            canvas.width / 2 - xInvaderOffset - 4,
            canvas.height / 2 + 125 - 21 + yOffset,
            Spaceship.offsetX,
            Spaceship.offsetY
        )
    } // end onload
}
