import {
  Actor,
  Circle,
  CollisionType,
  Color,
  Engine,
  Graphic,
  GraphicsGroup,
  InputHost,
  Keys,
  ParticleEmitter,
  Vector,
  vec,
} from "excalibur"
import { ParticleSystems } from "./particles"

const PlayerParams = {
  Speed: 0.2,
  TurnStepMultiplier: 0.004,
  Colors: [
    { start: Color.Rose, end: Color.Chartreuse } as const,
    { start: Color.Orange, end: Color.Violet } as const,
    { start: Color.Azure, end: Color.Magenta } as const,
  ] as const,
  ParticleSystemSetting: ParticleSystems.V1,
} as const

class PointLight extends GraphicsGroup {
  constructor({
    radius,
    density,
    curve,
    color,
  }: {
    radius: number
    density: number
    curve: (t: number) => number
    color: Color
  }) {
    const members: Graphic[] = []
    for (let i = 0; i < density; i++) {
      const t = i / density
      const r = curve(t) * radius
      members.push(new Circle({ radius: r, color, padding: radius - r }))
    }
    super({ members })
  }

  set color(c: Color) {
    for (const member of this.members) (member as Circle).color = c
  }
}

export class Player extends Actor {
  speed: number
  colors: readonly { start: Color; end: Color }[]
  colorIndex: number
  emitter: ParticleEmitter
  tail: number = 1
  pointLight: PointLight
  constructor(
    {
      pos,
      speed = PlayerParams.Speed,
      colors = PlayerParams.Colors,
      colorIndex = 0,
    }: {
      pos: Vector
      speed?: number
      colors?: readonly { start: Color; end: Color }[]
      colorIndex?: number
    },
    public angle = 0,
  ) {
    super({
      // Use a circle collider with radius 10
      radius: 10,
      // Set the color
      // color: colors[0]!.start,
      opacity: 0.3,
      vel: vec(0, 0),
      acc: vec(0, 0),
      pos,
      anchor: vec(0.5, 0.5),
    })
    this.speed = speed
    this.colors = colors
    this.colorIndex = colorIndex
    this.emitter = new ParticleEmitter({
      isEmitting: true,
      width: 8,
      height: 8,
      // emitRate: 200,
      // emitterType: EmitterType.Circle,
      // beginColor: this.colors[this.colorIndex].start,
      // endColor: this.colors[this.colorIndex].end,
      // isEmitting: true,
      // radius: 3,
      // minAngle: 0,
      // maxAngle: Math.PI * 2,
      // fadeFlag: true,
      // minVel: 10,
      // maxVel: 100,
      // minSize: 1,
      // maxSize: 1,
      // endSize: 45,
      // startSize: 6,
      // particleLife: 2000,
    })
    PlayerParams.ParticleSystemSetting.setEmitterConfiguration(this.emitter, {
      beginColor: this.colors[this.colorIndex].start,
      endColor: this.colors[this.colorIndex].end,
      length: this.tail,
    })
    this.addChild(this.emitter)
    this.pointLight = new PointLight({
      radius: 25,
      density: 20,
      curve: t => Math.pow(t, 4),
      color: this.colors[this.colorIndex].start,
    })
    // const color = this.colors[this.colorIndex].start
    // const g = new GraphicsGroup({
    //   members: [
    //     new Circle({
    //       radius: 6,
    //       color,
    //       padding: 11,
    //     }),
    //     new Circle({ radius: 7, color, padding: 10 }),
    //     new Circle({ radius: 8, color, padding: 9 }),
    //     new Circle({ radius: 9, color, padding: 8 }),
    //     new Circle({ radius: 15, color }),
    //   ],
    // })
    this.graphics.use(this.pointLight)
    this.body.collisionType = CollisionType.Passive
    this.addTag("player")
    this.on("collisionstart", ev => {
      if (!ev.other.hasTag("enemy")) return
      ev.other.kill()
      this.cycleColor()
      this.pointLight.color = this.colors[this.colorIndex].start
      this.tail += 1
      PlayerParams.ParticleSystemSetting.setEmitterConfiguration(this.emitter, {
        beginColor: this.colors[this.colorIndex].start,
        endColor: this.colors[this.colorIndex].end,
        length: this.tail,
      })
    })

    const img = new Actor()
    this.addChild(img)
  }

  override update(engine: Engine<any>, delta: number): void {
    this.handleInput(engine.input, delta)
    this.stepPos(this.direction.scale(delta * this.speed))
  }

  handleInput(input: InputHost, delta: number) {
    if (input.keyboard.wasPressed(Keys.Space)) this.flip180()
    if (input.keyboard.isHeld(Keys.Left)) this.turnLeft1(delta)
    if (input.keyboard.isHeld(Keys.Right)) this.turnRight1(delta)
  }

  flip180() {
    this.angle += Math.PI
  }

  turnLeft1(delta: number) {
    this.angle -= delta * PlayerParams.TurnStepMultiplier
  }

  turnRight1(delta: number) {
    this.angle += delta * PlayerParams.TurnStepMultiplier
  }

  stepVel(amount: Vector) {
    this.vel.add(amount, this.vel)
  }

  stepPos(amount: Vector) {
    this.pos.add(amount, this.pos)
  }

  cycleColor() {
    this.colorIndex = (this.colorIndex + 1) % this.colors.length
    this.emitter.beginColor = this.colors[this.colorIndex].start
    this.emitter.endColor = this.colors[this.colorIndex].end
  }

  get direction() {
    return vec(Math.sin(this.angle), -Math.cos(this.angle))
  }
}
