export type Game = {
    ctx: CanvasRenderingContext2D
    canvasHeight: number
    canvasWidth: number
    gameState: string
    level: number
};

export type Player = {
    ctx: CanvasRenderingContext2D
    position: { x: number; y: number }
    velocity: { x: number; y: number }
}
