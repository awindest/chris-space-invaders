export type Game = {
    ctx: CanvasRenderingContext2D
    canvasHeight: number
    canvasWidth: number
    gameState: string
    level: number
};

export type Player = {
    context: CanvasRenderingContext2D
    image: HTMLImageElement
    position: { x: number; y: number }
    velocity: { x: number; y: number }
    rotation: number
    opacity: number
}

// export type Particle = {
//     canvasContext: CanvasRenderingContext2D
//      { position, velocity, radius, color, fades }
// }