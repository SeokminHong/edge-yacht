export const UPPER_SECTION = [
  'Aces',
  'Twos',
  'Threes',
  'Fours',
  'Fives',
  'Sixes',
] as const;

export const LOWER_SECTION = [
  'Four of a Kind',
  'Full House',
  'Small Straight',
  'Large Straight',
  'Yacht',
  'Chance',
] as const;

type UpperSection = typeof UPPER_SECTION[number];
type LowerSection = typeof LOWER_SECTION[number];
export type Score = { [K in UpperSection]: number } & {
  [K in LowerSection]: number;
} & {
  Bonus: number;
};

const calcScoreFor = (dice: number[], value: number) => {
  const count = dice.filter((d) => d === value).length;
  return count * value;
};
const getCounts = (dice: number[]) => {
  return dice.reduce(
    (acc, d) => ({ ...acc, [d]: (acc[d] ?? 0) + 1 }),
    {} as { [d: number]: number }
  );
};

export const scoreFunctions: {
  [K in UpperSection]: (dice: number[]) => number;
} & {
  [K in LowerSection]: (dice: number[]) => number;
} = {
  Aces: (dice: number[]) => calcScoreFor(dice, 1),
  Twos: (dice: number[]) => calcScoreFor(dice, 2),
  Threes: (dice: number[]) => calcScoreFor(dice, 3),
  Fours: (dice: number[]) => calcScoreFor(dice, 4),
  Fives: (dice: number[]) => calcScoreFor(dice, 5),
  Sixes: (dice: number[]) => calcScoreFor(dice, 6),
  'Four of a Kind': (dice: number[]) => {
    const counts = getCounts(dice);
    const maxCount = Math.max(...Object.values(counts));
    if (maxCount > 4) {
      return dice.reduce((acc, count) => acc + count * count, 0);
    } else {
      return 0;
    }
  },
  'Full House': (dice: number[]) => {
    const counts = getCounts(dice);
    if (
      Object.values(counts).some((count) => count === 3) &&
      Object.values(counts).some((count) => count === 2)
    ) {
      return 25;
    } else {
      return 0;
    }
  },
  'Small Straight': (dice: number[]) => {
    const counts = dice.reduce((acc, d) => (acc |= 1 << d), 0);
    if (
      (counts & 0b001111) === 0b001111 ||
      (counts & 0b011110) === 0b011110 ||
      (counts & 0b11110) === 0b11110
    ) {
      return 30;
    } else {
      return 0;
    }
  },
  'Large Straight': (dice: number[]) => {
    const counts = dice.reduce((acc, d) => (acc |= 1 << d), 0);
    if ((counts & 0b011111) === 0b011111 || (counts & 0b111110) === 0b111110) {
      return 40;
    } else {
      return 0;
    }
  },
  Yacht: (dice: number[]) => {
    const counts = getCounts(dice);
    const maxCount = Math.max(...Object.values(counts));
    if (maxCount === 5) {
      return 50;
    } else {
      return 0;
    }
  },
  Chance: (dice: number[]) => dice.reduce((acc, d) => acc + d, 0),
};
