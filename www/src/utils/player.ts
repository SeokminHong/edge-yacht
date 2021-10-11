import { Score } from './score';

export type PlayerIndex = 1 | 2;
export type Player = {
  id: PlayerIndex;
  score: Score;
};

export const ZERO_SCORE: Player['score'] = {
  Aces: 0,
  Twos: 0,
  Threes: 0,
  Fours: 0,
  Fives: 0,
  Sixes: 0,
  'Four of a Kind': 0,
  'Full House': 0,
  'Small Straight': 0,
  'Large Straight': 0,
  Yacht: 0,
  Chance: 0,
  Bonus: 0,
};
