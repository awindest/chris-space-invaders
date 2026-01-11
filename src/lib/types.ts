export interface PositionType {
    x: number;
    y: number;
}

export interface VelocityType {
    x: number;
    y: number;
}

export interface GlobalGameStateType {
    canvasContext: CanvasRenderingContext2D
    canvasHeight: number
    canvasWidth: number
    gameState: string
    wave: number
    okToPlaySound: boolean
}

export interface SplashScreenType {
    canvasContext: CanvasRenderingContext2D
    invadersLogo: HTMLImageElement
    invadersSpriteSheet: HTMLImageElement
    canvasWidth: number
    canvasHeight: number
    fontSize: number
    drawSplashScreen: () => void
    drawScoringScreen: () => number | NodeJS.Timeout
}

export interface PlayerType {
    canvasContext: CanvasRenderingContext2D
    update: () => void
    shoot: (fireballs: FireballType[]) => void

    // canvasWidth: number
    // canvasHeight: number
    position: PositionType
    velocity: VelocityType
    // image: HTMLImageElement
    rotation: number
    opacity: number
    width: number
    height: number
}
export interface InvaderMissileType {
    canvasContext: CanvasRenderingContext2D
    invadersSpriteSheet: HTMLImageElement
    frameX: number
    position: PositionType
    velocity: VelocityType
    // height: number
    // width: number
    draw: () => void
    update: (deltaTime: DOMHighResTimeStamp) => void

}
export type InvaderType = {
    canvasContext: CanvasRenderingContext2D
    invadersSpriteSheet: HTMLImageElement
    spriteRow: number
    position: PositionType
    velocity: VelocityType
    frameX: number
    timer: number
    fps: number
    interval: number
    width: number
    height: number
    // color: string
    update: (deltaTime: DOMHighResTimeStamp, { velocity }: { velocity: VelocityType }) => void
    draw: () => void
    shoot: (invaderMissile: InvaderMissileType[]) => void

}

export type InvaderGridType = {
    canvasContext: CanvasRenderingContext2D
    // canvasWidth: number
    invadersSpriteSheet: HTMLImageElement
    // invaderPattern: [number]
    // position: PositionType
    velocity: VelocityType
    invaders: InvaderType[]
    width: number
    update: () => void
}

export type ParticleType = {
    canvasContext: CanvasRenderingContext2D
    position: PositionType
    velocity: VelocityType
    radius: number
    color: string
    fades: boolean
    opacity: number
    draw: () => void
    update: () => void
}

export type FireballType = {
    canvasContext: CanvasRenderingContext2D
    canvasWidth: number
    canvasHeight: number
    position: PositionType
    velocity: VelocityType
    frameY: number
    timer: number
    fps: number
    interval: number
    // image: HTMLImageElement
    update: (deltaTime: DOMHighResTimeStamp) => void
}