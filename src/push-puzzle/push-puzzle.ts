import { Statue } from './statue';
import { statues, blocked } from './puzzleBuilder';

const MAX_DISTANCE = 4;

export class PushPuzzle {
  base: Entity;
  room: Entity;

  constructor() {
    this.base = new Entity();
    this.base.addComponent(new GLTFShape('models/base.glb'));
    engine.addEntity(this.base);

    this.room = new Entity();
    this.room.addComponent(new GLTFShape('models/room.glb'));
    engine.addEntity(this.room);
  }

  fire(event: any): void {
    if (event.hit.meshName == 'statue_collider') {
      let statue = engine.entities[event.hit.entityId] as Statue;
      let statuePos = statue.getComponent(Transform).position;
      let distance = Vector3.Distance(statuePos, Camera.instance.position);
      if (distance < MAX_DISTANCE) {
        let currentPos = statue.getComponent(Transform).position;
        let endPos = currentPos.subtract(
          event.hit.normal.multiplyByFloats(2, 2, 2)
        );

        // Checks if anything is blocking the statue's path
        let isOverlapped = statues.some((statue) => {
          return endPos.equals(statue.getComponent(Transform).position);
        });
        let isBlocked = blocked.some((block) => {
          return endPos.equals(block);
        });

        // Check boundaries
        if (
          endPos.x >= 4 &&
          endPos.x <= 12 &&
          endPos.z >= 1 &&
          endPos.z >= 5 &&
          endPos.z <= 11 &&
          !isOverlapped &&
          !isBlocked
        ) {
          statue.moveStatue(currentPos, endPos);
        }
      }
    }
  }
}
