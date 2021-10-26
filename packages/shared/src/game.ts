import { Player, PlayerIndex } from './player';
import { Dice } from './dice';
import { EMPTY_SCORE } from './score';

export type GameState = 'waiting' | 'playing' | 'finished';

export interface IGame {
  state: GameState;
  currentPlayer: PlayerIndex;
  boardDice: Dice[];
  savedDice: Dice[];
  players: Player[];
  rollCount: number;
  turn: number;
}

export const DEFAULT_GAME: IGame = {
  state: 'waiting',
  currentPlayer: 1,
  boardDice: [
    { id: 1, value: 1 },
    { id: 2, value: 1 },
    { id: 3, value: 1 },
    { id: 4, value: 1 },
    { id: 5, value: 1 },
  ],
  savedDice: [],
  players: [
    { id: 1, score: { ...EMPTY_SCORE } },
    { id: 2, score: { ...EMPTY_SCORE } },
  ],
  rollCount: 0,
  turn: 1,
};
