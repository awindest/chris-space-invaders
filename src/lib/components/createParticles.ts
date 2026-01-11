// particles explode and fade out for invaders and player

import type { InvaderType, ParticleType, PlayerType } from "$lib/types";
import { Particle } from '$components/Particle.svelte'

export function createParticles(canvasContext: CanvasRenderingContext2D, particles: ParticleType[] = [],
    { object, color, fades }: { object: InvaderType | PlayerType; color: string; fades: boolean }) {
    for (let i = 0; i < 25; i++) {
        particles.push(
            new Particle(canvasContext, {
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                radius: Math.random() * 3,
                color: color || '#BAA0DE',
                fades: fades
            })
        )
    }
} // end of create particles