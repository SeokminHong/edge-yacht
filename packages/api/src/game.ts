import {
  GameState,
  IGame,
  EMPTY_SCORE,
  PlayerIndex,
  Player,
  Dice,
  Sections,
  scoreFunctions,
  rollDice,
  getOpponent,
  UPPER_SECTION,
} from 'shared';

export class Game implements IGame {
  state: GameState;
  currentPlayer: PlayerIndex;
  boardDice: Dice[];
  savedDice: Dice[];
  players: Player[];
  rollCount: number;
  turn: number;

  constructor() {
    this.state = 'waiting';
    (this.currentPlayer = 1),
      (this.boardDice = [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
        { id: 5, value: 1 },
      ]);
    (this.savedDice = []),
      (this.players = [
        { id: 1, score: { ...EMPTY_SCORE } },
        { id: 2, score: { ...EMPTY_SCORE } },
      ]);
    this.rollCount = 0;
    this.turn = 1;
  }

  start() {
    this.state = 'playing';
  }

  roll(player: PlayerIndex) {
    if (this.state !== 'playing') {
      throw new Error('Game is not started');
    }
    if (player !== this.currentPlayer) {
      throw new Error(`It is not Player ${player}'s turn`);
    }

    this.rollCount++;

    this.boardDice = this.boardDice.map(({ id }) => ({
      id,
      value: rollDice(),
    }));
  }

  save(player: PlayerIndex, id: number) {
    if (this.state !== 'playing') {
      throw new Error('Game is not started');
    }
    if (player !== this.currentPlayer) {
      throw new Error(`It is not Player ${player}'s turn`);
    }
    if (this.rollCount === 0) {
      throw new Error('You must roll the dice first');
    }

    const dice = this.boardDice.find((dice) => dice.id === id);
    if (!dice) {
      throw new Error(`Dice with id ${id} not found`);
    }

    this.savedDice.push(dice);
    this.boardDice = this.boardDice.filter((dice) => dice.id !== id);
  }

  load(player: PlayerIndex, id: number) {
    if (this.state !== 'playing') {
      throw new Error('Game is not started');
    }
    if (player !== this.currentPlayer) {
      throw new Error(`It is not Player ${player}'s turn`);
    }
    if (this.rollCount === 0) {
      throw new Error('You must roll the dice first');
    }

    const dice = this.savedDice.find((dice) => dice.id === id);
    if (!dice) {
      throw new Error(`Dice with id ${id} not found`);
    }

    this.boardDice.push(dice);
    this.savedDice = this.savedDice.filter((dice) => dice.id !== id);
  }

  select(player: PlayerIndex, section: Sections) {
    if (this.state !== 'playing') {
      throw new Error('Game is not started');
    }
    if (player !== this.currentPlayer) {
      throw new Error(`It is not Player ${player}'s turn`);
    }
    if (this.rollCount === 0) {
      throw new Error('You must roll the dice first');
    }

    const diceValues = [
      ...this.boardDice.map((dice) => dice.value),
      ...this.savedDice.map((dice) => dice.value),
    ];
    const score = scoreFunctions[section](diceValues);
    if (score === null) {
      throw new Error(`Score is invalid`);
    }
    this.players[player - 1].score[section] = score;

    // Update bonus
    const [upperSum, hasNull] = UPPER_SECTION.reduce(
      ([sum, hasNull], section) => [
        sum + (this.players[player - 1].score[section] ?? 0),
        hasNull || this.players[player - 1].score[section] === null,
      ],
      [0, false]
    );
    if (upperSum >= 63) {
      this.players[player - 1].score.Bonus = 35;
    } else if (!hasNull) {
      // Set bonus as 0 when the upper sections are full but not more than 63.
      this.players[player - 1].score.Bonus = 0;
    }

    // Change turn
    if (player === 2) {
      this.turn++;
    }
    if (this.turn === 13) {
      this.state = 'finished';
    }
    this.rollCount = 0;
    this.currentPlayer = getOpponent(this.currentPlayer);
    this.savedDice.forEach((dice) => this.boardDice.push(dice));
    this.savedDice = [];
  }

  toString(): string {
    return JSON.stringify({ type: 'game', payload: this });
  }
}
