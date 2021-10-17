export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type Dice = {
  id: number;
  value: DiceValue;
};

export const rollDice = () => (Math.floor(Math.random() * 6) + 1) as DiceValue;
