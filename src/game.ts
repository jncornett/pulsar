import {
  Color,
  DisplayMode,
  Engine,
  Font,
  Label,
  Scene,
  ScrollPreventionMode,
  vec,
} from "excalibur"
import { Player } from "./objects/player"
import { Enemy } from "./objects/enemy"
import { Resources } from "./assets/resources"

const createGame = (canvas: HTMLCanvasElement) => {
  const game = new Engine({
    width: 640,
    height: 480,
    backgroundColor: Color.Black,
    displayMode: DisplayMode.FitScreen,
    scrollPreventionMode: ScrollPreventionMode.All,
    canvasElement: canvas,
    pixelArt: true,
    pixelRatio: 2,
  })

  {
    const splash = new Scene()
    game.addScene("splash", { scene: splash })
    const title = new Label({
      text: "evo",
      pos: vec(0, 0),
      color: Color.White,
      font: new Font({ size: 48 }),
    })

    splash.add(title)
  }

  {
    const menu = new Scene()
    game.addScene("menu", { scene: menu })

    const startGame = new Label({
      text: "Start Game",
      color: Color.White,
      font: new Font({ size: 48 }),
    })
    menu.add(startGame)

    startGame.on("pointerdown", () => {
      game.goToScene("scope")
    })

    const configureSettings = new Label({
      text: "Settings",
      color: Color.White,
      font: new Font({ size: 48 }),
    })
    menu.add(configureSettings)

    const viewCredits = new Label({
      text: "Credits",
      color: Color.White,
      font: new Font({ size: 48 }),
    })
    menu.add(viewCredits)
  }

  {
    const scope = new Scene()
    game.addScene("scope", { scene: scope })
    scope.on("preload", ({ loader }) => {
      loader.addResource(Resources.nyanSpriteSheet)
      return
    })

    const center = vec(game.drawWidth / 2, game.drawHeight / 2)

    const player = new Player({ pos: center })
    player.on("collisionstart", () => {})
    scope.add(player)
    scope.camera.strategy.elasticToActor(player, 0.1, 0.1)
    let handle: number
    const enemies: Enemy[] = []
    scope.on("activate", () => {
      clearInterval(handle)
      handle = setInterval(() => {
        if (enemies.length > 10) return
        const r = Math.random() * 300
        const a = Math.random() * Math.PI * 2
        const pos = player.pos.add(vec(r * Math.cos(a), r * Math.sin(a)))
        const enemy = new Enemy(pos, 0, 1000 * 120)
        scope.add(enemy)
        enemies.push(enemy)
        enemy.on("kill", () => {
          enemies.splice(enemies.indexOf(enemy), 1)
        })
      }, 2000)
    })
    scope.on("preupdate", ev => {
      enemies.forEach(enemy => {
        const f = enemies.reduce(
          (acc, e) => acc.add(e.pos.sub(enemy.pos).normalize(), acc),
          vec(0, 0),
        )
        f.add(enemy.pos.sub(player.pos).normalize().negate(), f)
        enemy.body.acc = f.scale(3).clampMagnitude(100)
      })
    })
  }

  return game
}

export const run = (canvas: HTMLCanvasElement) => {
  const game = createGame(canvas)
  game.goToScene("scope")
  game.start()
  // setTimeout(() => {
  //   game.goToScene("menu")
  // }, 5000)
  return game
}
