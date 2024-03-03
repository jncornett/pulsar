import { ImageSource } from "excalibur"
import nyan from "./nyan.png"

export const Resources = {
  nyanSpriteSheet: new ImageSource(nyan),
} as const
