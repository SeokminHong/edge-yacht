import { isSSR } from '~utils/window';

import diceRoll01 from './dice_roll_01.mp3';
import diceRoll02 from './dice_roll_02.mp3';
import diceShake01 from './dice_shake_01.mp3';
import diceShake02 from './dice_shake_02.mp3';

// Create clone copies of audio for playing simultaneously
export class AudioPlayer {
  audios: HTMLAudioElement[][];
  counter: number[];
  instances: number;

  /** @param instances should be larger than 1 */
  constructor(urls: string[], instances: number) {
    this.instances = instances;
    this.counter = Array(urls.length).fill(0);
    if (isSSR) {
      this.audios = [];
      return;
    }
    this.audios = urls.map((u) =>
      [...Array(instances)].map(() => new Audio(u))
    );
  }

  play() {
    const audioIndex = Math.floor(Math.random() * this.audios.length);
    this.audios[audioIndex][this.counter[audioIndex]].play();
    this.counter[audioIndex] = (this.counter[audioIndex] + 1) % this.instances;
  }
}

// Roll is an once-off audio, so it doesn't need to be pooled
export const diceRoll = new AudioPlayer([diceRoll01, diceRoll02], 1);

export const diceShake = new AudioPlayer([diceShake01, diceShake02], 3);
