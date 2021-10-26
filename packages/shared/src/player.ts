import { Score } from './score';

export type PlayerIndex = 1 | 2;
export const getOpponent = (index: PlayerIndex) => (index === 1 ? 2 : 1);

export type Player = {
  id: PlayerIndex;
  score: Score;
};
