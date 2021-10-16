export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export class Dice {
  id: number;
  value: DiceValue;

  constructor(id: number, value: DiceValue) {
    this.id = id;
    this.value = value;
  }

  roll(): void {
    this.value = (Math.floor(Math.random() * 6) + 1) as DiceValue;
  }
}

export const rollDice = () => (Math.floor(Math.random() * 6) + 1) as DiceValue;
