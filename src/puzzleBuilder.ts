import { Statue } from "./statue"
import utils from "../node_modules/decentraland-ecs-utils/index"
import { Sound } from "./sound"

// Sounds
const statueMoveSound = new Sound(new AudioClip("sounds/statueMove.mp3"), false)

// Setup coordinates
export const blocked: Vector3[] = [new Vector3(12, 0.16, 9), new Vector3(4, 0.16, 7)]
export const solution: Vector3[] = [new Vector3(4, 0.16, 5), new Vector3(12, 0.16, 5), new Vector3(12, 0.16, 7), new Vector3(12, 0.16, 11)]
export const restartPos: Vector3[] = [new Vector3(6, 0.16, 9), new Vector3(6, 0.16, 7), new Vector3(8, 0.16, 7), new Vector3(8, 0.16, 5)]

// Statue
export const statues: Statue[] = []
const statueShape = new GLTFShape("models/statue.glb")

for (let i = 0; i < restartPos.length; i++) {
  const statue = new Statue(statueShape, new Transform({ position: new Vector3(6, 0.16, 9) }))
  statues.push(statue)
}

export function checkSolution(): boolean {
  let count = 0
  for (let i = 0; i < statues.length; i++) {
    for (let j = 0; j < solution.length; j++) {
      if (statues[i].getComponent(Transform).position.equals(solution[j])) {
        statues[i].toggleGlow(true)
        count++
        break
      } else {
        statues[i].toggleGlow(false)
      }
    }
  }
  log(count)
  if (count == 4) return true
  return false
}

// Create triggers for resetting the game
const exitGlow = new Entity()
exitGlow.addComponent(new GLTFShape("models/exitGlow.glb"))
engine.addEntity(exitGlow)

const resetFrontTrigger = new Entity()
engine.addEntity(resetFrontTrigger)
const resetBackTrigger = new Entity()
engine.addEntity(resetBackTrigger)

let resetTriggerFront = new utils.TriggerBoxShape(new Vector3(16, 3.5, 3.5), new Vector3(8, 1.75, 1.75))
let resetTriggerBack = new utils.TriggerBoxShape(new Vector3(16, 3.5, 3.5), new Vector3(8, 1.75, 14.25))

resetFrontTrigger.addComponent(
  new utils.TriggerComponent(resetTriggerFront, null, null, null, null, () => {
    restartGame()
  })
)
resetBackTrigger.addComponent(
  new utils.TriggerComponent(resetTriggerBack, null, null, null, null, () => {
    restartGame()
  })
)

export function restartGame() {
  statueMoveSound.getComponent(AudioSource).playOnce()
  for (let i = 0; i < statues.length; i++) {
    statues[i].getComponent(Transform).position = restartPos[i]
    statues[i].toggleGlow(false)
  }
}

export function finishGame() {
  engine.removeEntity(exitGlow)
  engine.removeEntity(resetFrontTrigger)
  engine.removeEntity(resetBackTrigger)
  log("You win")
}