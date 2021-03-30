import { PushPuzzle } from './push-puzzle/push-puzzle';

// Instance the input object
const input = Input.instance;

const pushPuzzle = new PushPuzzle();
// Button down event
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, (event) => {
  pushPuzzle.fire(event);
});
