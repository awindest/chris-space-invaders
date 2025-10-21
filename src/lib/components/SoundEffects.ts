let missileLaunchSound: HTMLAudioElement[] = []
let invaderWalkSound: HTMLAudioElement
let introSound: HTMLAudioElement
let playerExplosionSound: HTMLAudioElement[] = []

// Initialize sound
export function initAudio() {
    // sound and music
    // player missiles, 4 slots should do
    missileLaunchSound = [new Audio(), new Audio(), new Audio(), new Audio()]
    missileLaunchSound[0].src = '/audio/PlayerMissile.wav'
    missileLaunchSound[1].src = '/audio/PlayerMissile.wav'
    missileLaunchSound[2].src = '/audio/PlayerMissile.wav'
    missileLaunchSound[3].src = '/audio/PlayerMissile.wav'

    playerExplosionSound = [new Audio(), new Audio()]
    playerExplosionSound[0].src = '/audio/PlayerExplosion.wav'
    playerExplosionSound[1].src = '/audio/PlayerExplosion.wav'

    invaderWalkSound = new Audio('/audio/InvaderWalk.wav')

    introSound = new Audio('/audio/BackgroundMusic.wav')
}
// Play pretty background music
export function playIntroMusic() {
    if (introSound.ended || introSound.currentTime === 0) {
        introSound.volume = 0.5
        introSound.play()
    } // end if
} // end playIntroMusic

// Play invader walk
export function playInvaderWalk() {
    if (invaderWalkSound.ended || invaderWalkSound.currentTime === 0) {
        invaderWalkSound.volume = 0.5
        invaderWalkSound.play()
    } // end if
} // end playInvaderWalk

// Player shooting - play missile sound
export function playMissileSound() {
    // play missile blast sound, scan for available sound
    for (let sound of missileLaunchSound) {
        if (sound.ended || sound.currentTime == 0) {
            sound.volume = 0.5
            sound.play()
            break
        } // end if
    } // end for
} // end playMissileSound

// Player dies - play explosion sound
export function playExplosionSound() {
    for (let sound of playerExplosionSound) {
        if (sound.ended || sound.currentTime == 0) {
            sound.volume = 0.5
            sound.play()
            break
        } // end if
    } // end for
} // end playExplosionSound
