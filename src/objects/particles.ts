import { Color, EmitterType, ParticleEmitter } from "excalibur"

export type EmitterTheme = {
  beginColor: Color
  endColor: Color
  length: number
}

export const Themes = {
  GREENSPORE: { beginColor: Color.Chartreuse, endColor: Color.Cyan },
  GLORY: { beginColor: Color.Rose, endColor: Color.Chartreuse },
} as const

// const PlayerParams = {
//   Speed: 0.2,
//   TurnStepMultiplier: 0.004,
//   Colors: [
//     { start: Color.Rose, end: Color.Chartreuse } as const,
//     { start: Color.Orange, end: Color.Violet } as const,
//     { start: Color.Azure, end: Color.Magenta } as const,
//   ] as const,
// } as const

export type ParticleSystem = {
  setEmitterConfiguration: (
    particleEmitter: ParticleEmitter,
    theme: EmitterTheme,
  ) => void
}

export const TAU = Math.PI * 2

export const ParticleSystems = {
  V0: {
    setEmitterConfiguration: (
      particleEmitter: ParticleEmitter,
      theme: EmitterTheme,
    ) => {
      Object.assign(particleEmitter, {
        emitRate: 200,
        emitterType: EmitterType.Circle,
        beginColor: theme.beginColor,
        endColor: theme.endColor,
        radius: 3,
        minAngle: 0,
        maxAngle: TAU,
        fadeFlag: true,
        minVel: 10,
        maxVel: 100,
        minSize: 1,
        maxSize: 1,
        endSize: 45,
        startSize: 6,
        particleLife: 2000 * theme.length,
      })
    },
  },
  V1: {
    setEmitterConfiguration: (
      particleEmitter: ParticleEmitter,
      theme: EmitterTheme,
    ) => {
      Object.assign(particleEmitter, {
        emitRate: 90,
        emitterType: EmitterType.Circle,
        radius: 1,
        beginColor: theme.beginColor,
        endColor: theme.endColor,
        minAngle: 0,
        maxAngle: TAU,
        fadeFlag: true,
        minVel: 0,
        maxVel: 10,
        minSize: 1,
        endSize: 20,
        startSize: 5,
        particleLife: 300 * Math.sqrt(theme.length),
        opacity: 0.9,
      })
    },
  },
} as const
