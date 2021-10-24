import { Score } from './score';
import { User } from './user';

export type PlayerIndex = 1 | 2;
export const getOpponent = (index: PlayerIndex) => (index === 1 ? 2 : 1);

export type Player = {
  id: PlayerIndex;
  score: Score;
};

export type PlayerInfo =
  | {
      type: 'guest';
      id: string;
    }
  | { type: 'user'; user: User };
