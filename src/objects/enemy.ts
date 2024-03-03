import {
  Actor,
  CollisionType,
  Color,
  EmitterType,
  Engine,
  ParticleEmitter,
  Vector,
  vec,
} from "excalibur"

export class Enemy extends Actor {
  constructor(
    pos: Vector,
    angle = 0,
    public ttl = 1000,
  ) {
    super({
      radius: 4,
      color: Color.Transparent,
      acc: vec(0, 0),
      vel: vec(0, 0),
      pos,
    })

    const emitter = new ParticleEmitter({
      emitRate: 60,
      emitterType: EmitterType.Circle,
      beginColor: Color.ExcaliburBlue,
      isEmitting: true,
      radius: 3,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      fadeFlag: true,
      minVel: 3,
      maxVel: 20,
      minSize: 1,
      maxSize: 1,
      endColor: Color.Cyan,
      startSize: 4,
      opacity: 0.8,
      // endSize: 2,
      focus: vec(100, 200),
      particleLife: 1500,
    })
    this.addChild(emitter)
    this.addTag("enemy")
    this.body.collisionType = CollisionType.Active
  }

  onPreUpdate(engine: Engine<any>, delta: number): void {
    this.ttl -= delta
    if (this.ttl <= 0) {
      this.kill()
    }
  }
}
