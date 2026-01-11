import { cInvader, cSpaceship } from '$lib/config.svelte' // game constants
export class SplashScreen {
    canvasContext: CanvasRenderingContext2D
    invadersLogo: HTMLImageElement
    invadersSpriteSheet: HTMLImageElement
    canvasWidth: number
    canvasHeight: number
    fontSize: number

    constructor(canvasContext: CanvasRenderingContext2D, invadersSpriteSheet: HTMLImageElement) {
        this.canvasContext = canvasContext
        this.canvasWidth = canvasContext.canvas.width
        this.canvasHeight = canvasContext.canvas.height
        this.invadersSpriteSheet = invadersSpriteSheet
        this.fontSize = 20

        this.canvasContext.font = `${this.fontSize}px beefd` // pre-loaded in header so they show up correctly
        this.canvasContext.fillStyle = '#F4FFBF'

        this.invadersLogo = new Image()
        this.invadersLogo.src = '/images/spaceInvadersLogoTrans.png'
        this.invadersLogo.onload = () => {
            //this.canvasContext.drawImage(this.invadersLogo, (this.canvasWidth - this.invadersLogo.width) / 2, -80)
            this.drawSplashScreen()
        } // end onload
    }
    drawSplashScreen() {
        if (this.invadersLogo)
            this.canvasContext.drawImage(this.invadersLogo, (this.canvasWidth - this.invadersLogo.width) / 2, -80)

    }
    drawScoringScreen(): number | NodeJS.Timeout {
        // crazy number of parameters to get images and text on a canvas
        const xInvaderOffset = 115
        const yInvaderOffset = 95 // 75
        const ySpaceshipOffset = 100 // 80
        const xTextOffset = 45
        const yTextOffset = 125 // 105


        // array of text for number of points scored for shooting an invader
        const points: string[] = ['30', '20', '10']

        const text = 'PRESS SPACEBAR TO PLAY'

        const textWidth = this.canvasContext.measureText(text).width
        const x = (this.canvasWidth - textWidth) / 2
        const y = .85 * this.canvasHeight
        const fontSize = this.fontSize

        let visible = true
        let intervalId: number | NodeJS.Timeout = 0

        // loop over the scores
        points.forEach((value, i) => {
            // sequencially delay appearance of each line of invader icon + point score
            setTimeout(() => { // draw invader
                // nine arguments to drawImage: 1: image source, 2: source X, 3: source Y, 4: source width
                // 5: source height, 6: destination X, 7: destination Y, 8: destination width, 9: destination height

                this.canvasContext.drawImage(this.invadersSpriteSheet,
                    cInvader.spritePositionX,
                    i * cInvader.height,
                    cInvader.width,
                    cInvader.height,
                    this.canvasWidth / 2 - xInvaderOffset,
                    this.canvasHeight / 2 + cInvader.height * i + yInvaderOffset,
                    cInvader.width,
                    cInvader.height
                )
                this.canvasContext.fillText(`= ${value} PTS`,
                    this.canvasWidth / 2 - xTextOffset,
                    this.canvasHeight / 2 + yTextOffset + cInvader.height * i)

            }, 1000 * (i + 1))

        })
        this.canvasContext.save()

        setTimeout(() => {
            this.canvasContext.fillText('= ??? PTS',
                this.canvasWidth / 2 - xTextOffset,
                this.canvasHeight / 2 + yTextOffset + cInvader.height * 3)

            this.canvasContext.drawImage(this.invadersSpriteSheet,
                cSpaceship.spritePositionX,
                cSpaceship.spritePositionY,
                cSpaceship.width,
                cSpaceship.height,
                this.canvasWidth / 2 - xInvaderOffset - 7,
                this.canvasHeight / 2 + cInvader.height * 3 + ySpaceshipOffset,
                cSpaceship.width,
                cSpaceship.height
            )
            // draw a horizontal line in the middle of the canvas
            this.canvasContext.moveTo(this.canvasWidth / 2, 0)
            this.canvasContext.lineTo(this.canvasWidth / 2, this.canvasHeight)
            this.canvasContext.strokeStyle = "white"
            this.canvasContext.stroke()
        }, 1000 * 4)



        setTimeout(() => {
            this.canvasContext.fillStyle = 'red'

            // Start the blinking effect, e.g., every 1000 milliseconds
            intervalId = setInterval(() => {

                this.canvasContext.clearRect(x, y - fontSize * 2, textWidth, fontSize * 1.9)

                if (visible) {
                    this.canvasContext.fillText(text, x, y)
                }
                visible = !visible; // Toggle visibility

            }, 1000) // end of setInterval


        }, 1000 * 4) // five second delay for the scores to paint
        return intervalId // for clean up when we change state to 'playing'

    }
}




