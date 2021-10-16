import { Score } from './score';
import { PlayerIndex } from 'shared';

export type Player = {
  id: PlayerIndex;
  score: Score;
};

export const EMPTY_SCORE: Player['score'] = {
  Aces: null,
  Twos: null,
  Threes: null,
  Fours: null,
  Fives: null,
  Sixes: null,
  Chance: null,
  'Four of a Kind': null,
  'Full House': null,
  'Small Straight': null,
  'Large Straight': null,
  Yacht: null,
  Bonus: null,
};
