import * as utils from '@dcl/ecs-scene-utils';
import { checkSolution, finishGame } from './puzzleBuilder';
import { Sound } from './sound';

// Sounds
const statueMoveSound = new Sound(
  new AudioClip('sounds/statueMove.mp3'),
  false
);

export class Statue extends Entity {
  public symbol = new Entity();
  public symbolGlow = new Entity();

  constructor(statue: GLTFShape, transform: Transform) {
    super();
    engine.addEntity(this);
    this.addComponent(statue);
    this.addComponent(transform);

    this.symbol.addComponent(new GLTFShape('models/symbol.glb'));
    this.symbol.addComponent(new Transform());
    this.symbol.setParent(this);

    this.symbolGlow.addComponent(new GLTFShape('models/symbolGlow.glb'));
    this.symbolGlow.addComponent(new Transform());
    this.symbolGlow.getComponent(Transform).scale.setAll(0);
    this.symbolGlow.setParent(this);
  }

  toggleGlow(isOn: boolean): void {
    if (isOn) {
      this.symbol.getComponent(Transform).scale.setAll(0);
      this.symbolGlow.getComponent(Transform).scale.setAll(1);
    } else {
      this.symbol.getComponent(Transform).scale.setAll(1);
      this.symbolGlow.getComponent(Transform).scale.setAll(0);
    }
  }

  moveStatue(currentPos: Vector3, endPos: Vector3): void {
    // Slide the statue to its endPos over half a second
    if (!this.hasComponent(utils.MoveTransformComponent)) {
      statueMoveSound.getComponent(AudioSource).playOnce();
      this.addComponent(
        new utils.MoveTransformComponent(currentPos, endPos, 0.5, () => {
          if (checkSolution()) finishGame();
        })
      );
    }
  }
}
