export const UPPER_SECTION = [
  "Aces",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
] as const;

export const LOWER_SECTION = [
  "Chance",
  "Four of a Kind",
  "Full House",
  "Small Straight",
  "Large Straight",
  "Yacht",
] as const;

type UpperSection = typeof UPPER_SECTION[number];
type LowerSection = typeof LOWER_SECTION[number];
export type Score = { [K in UpperSection]: number | null } & {
  [K in LowerSection]: number | null;
} & {
  Bonus: number | null;
};
