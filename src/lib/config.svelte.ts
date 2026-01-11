export const cInvader = {
    width: 48,
    height: 36,
    spritePositionX: 0,
    spritePositionY: 0,
    maxFrame: 1
}
export const cInvaderGrid = {
    rows: 5,//5,
    columns: 11//11
}
export const cSpaceship = {
    width: 64,
    height: 28,
    speed: 1,
    cellX: 0,
    cellY: 0,
    spritePositionX: 0,
    spritePositionY: 108,
    maxFrame: 3
}
export const cInvaderMissile = {
    width: 20,
    height: 30,
    spritePositionX: 0,
    spritePositionY: 136,
    maxFrame: 3
}

// fireball sprite is in a separate file
export const cFireball = {
    width: 20,
    height: 36.25,
    spritePositionX: 0,
    spritePositionY: 136,
    maxFrame: 3
}
export const cInvaderColors = ["#03FF07", "#03FFFF", "#ff00ff", "#FF0", "#F00",];
export const L0 = [0, 1, 1, 2, 2]
// level 0: G B B M M = [0, 1, 1, 2, 2]
// level 1: M M Y Y R = [2, 2, 3, 3, 4]
// level 2: B M M Y Y = [1, 2, 2, 3, 3]
// then repeat, levelColors %= 3?