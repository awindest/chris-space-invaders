// import { Invader, Spaceship } from '$lib/config'

export function drawBitmapFromSpriteSheet(
    canvasContext,
    cellX,
    cellY,
    borderWidth,
    spriteWidth,
    spriteHeight,
    spriteImageSheet,
    x,
    y,
    originX = 0,
    originY = 0
) {
    // absolute origin to support starting (0,0) origin at
    // arbitrary (x,y) in sprite sheet
    // draw an image to the canvas from the sprite sheet
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    let offsetX = originX + (cellX + 1) * borderWidth + cellX * spriteWidth
    let offsetY = originY + (cellY + 1) * borderWidth + cellY * spriteHeight

    canvasContext.drawImage(
        spriteImageSheet,
        offsetX,
        offsetY,
        spriteWidth,
        spriteHeight,
        Math.floor(x + 0.5),
        Math.floor(y + 0.5),
        spriteWidth,
        spriteHeight
    )
} // end DrawBitmapFromSpriteSheet
