import { isSSR } from '~utils/window';

import diceRoll01 from './dice_roll_01.mp3';
import diceRoll02 from './dice_roll_01.mp3';
import diceShake01 from './dice_shake_01.mp3';
import diceShake02 from './dice_shake_02.mp3';

// Create clone copies of audio for playing simultaneously
export class AudioPlayer {
  audios: HTMLAudioElement[];
  counter: number;
  instances: number;

  /** @param instances should be larger than 1 */
  constructor(url: string, instances: number) {
    this.instances = instances;
    this.counter = 0;
    if (isSSR) {
      this.audios = [];
      return;
    }
    this.audios = [...Array(instances)].map(() => new Audio(url));
  }

  play() {
    this.audios[this.counter].play();
    this.counter = (this.counter + 1) % this.instances;
  }
}

// Roll is an once-off audio, so it doesn't need to be pooled
export const diceRoll = [diceRoll01, diceRoll02].map(
  (audio) => new AudioPlayer(audio, 1)
);

export const diceShake = [diceShake01, diceShake02].map(
  (audio) => new AudioPlayer(audio, 5)
);
