import { run } from "./game"

const canvas = document.getElementById("canvas") as HTMLCanvasElement

const game = run(canvas)

const fullscreenButton = document.getElementById(
  "fullscreen",
) as HTMLButtonElement

fullscreenButton.addEventListener("click", () => {
  game.screen.goFullScreen()
})
