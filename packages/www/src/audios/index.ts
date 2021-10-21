import diceRoll01 from './dice_roll_01.mp3';
import diceRoll02 from './dice_roll_01.mp3';
import diceShake01 from './dice_shake_01.mp3';
import diceShake02 from './dice_shake_02.mp3';

const AUDIO_COUNT = 5;

// Clone an audio pool of audio for play simultaneously
export class AudioPlayer {
  audios: HTMLAudioElement[];
  counter: number;

  constructor(url: string) {
    const audio = new Audio(url);
    this.audios = [
      audio,
      audio.cloneNode() as HTMLAudioElement,
      audio.cloneNode() as HTMLAudioElement,
      audio.cloneNode() as HTMLAudioElement,
      audio.cloneNode() as HTMLAudioElement,
    ];
    this.counter = 0;
  }

  play() {
    this.audios[this.counter].play();
    this.counter = (this.counter + 1) % AUDIO_COUNT;
  }
}

// Roll is an once-off audio, so it doesn't need to be pooled
export const diceRoll = [diceRoll01, diceRoll02].map(
  (audio) => new Audio(audio)
);

export const diceShake = [diceShake01, diceShake02].map(
  (audio) => new AudioPlayer(audio)
);
