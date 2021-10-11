export type Dice = {
  value: number;
  saved: boolean;
};

export const rollDice = () => Math.floor(Math.random() * 6) + 1;

export const defaultDice: Dice = {
  value: 1,
  saved: false,
};
