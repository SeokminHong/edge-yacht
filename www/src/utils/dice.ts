export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type Dice = DiceNumber | null;

export const rollDice = () => (Math.floor(Math.random() * 6) + 1) as DiceNumber;

export const defaultDice: Dice = null;
