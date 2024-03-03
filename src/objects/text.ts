import { Color, Font, Text, Vector, vec } from "excalibur"

export class Title extends Text {
  constructor(text: string, pos: Vector = vec(0, 0)) {
    super({ text, color: Color.White, font: new Font({ size: 48 }), origin: pos })
  }
}
