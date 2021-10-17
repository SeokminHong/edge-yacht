import { Player, PlayerIndex } from './player';
import { Dice } from './dice';
import { EMPTY_SCORE } from './score';

export type GameState = 'waiting' | 'playing' | 'finished';

export interface IGame {
  state: GameState;
  currentPlayer: PlayerIndex;
  boardDices: Dice[];
  savedDices: Dice[];
  players: Player[];
  rolled: boolean;
}

export const DEFAULT_GAME: IGame = {
  state: 'waiting',
  currentPlayer: 1,
  boardDices: [
    { id: 1, value: 1 },
    { id: 2, value: 1 },
    { id: 3, value: 1 },
    { id: 4, value: 1 },
    { id: 5, value: 1 },
  ],
  savedDices: [],
  players: [
    { id: 1, score: EMPTY_SCORE },
    { id: 2, score: EMPTY_SCORE },
  ],
  rolled: false,
};
