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
} from 'shared';

export class Game implements IGame {
  state: GameState;
  currentPlayer: PlayerIndex;
  boardDices: Dice[];
  savedDices: Dice[];
  players: Player[];
  rolled: boolean;

  constructor() {
    this.state = 'waiting';
    (this.currentPlayer = 1),
      (this.boardDices = [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
        { id: 5, value: 1 },
      ]);
    (this.savedDices = []),
      (this.players = [
        { id: 1, score: { ...EMPTY_SCORE } },
        { id: 2, score: { ...EMPTY_SCORE } },
      ]);
    this.rolled = false;
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

    this.rolled = true;

    this.boardDices = this.boardDices.map(({ id }) => ({
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
    if (!this.rolled) {
      throw new Error('You must roll the dice first');
    }

    const dice = this.boardDices.find((dice) => dice.id === id);
    if (!dice) {
      throw new Error(`Dice with id ${id} not found`);
    }

    this.savedDices.push(dice);
    this.boardDices = this.boardDices.filter((dice) => dice.id !== id);
  }

  load(player: PlayerIndex, id: number) {
    if (this.state !== 'playing') {
      throw new Error('Game is not started');
    }
    if (player !== this.currentPlayer) {
      throw new Error(`It is not Player ${player}'s turn`);
    }
    if (!this.rolled) {
      throw new Error('You must roll the dice first');
    }

    const dice = this.savedDices.find((dice) => dice.id === id);
    if (!dice) {
      throw new Error(`Dice with id ${id} not found`);
    }

    this.boardDices.push(dice);
    this.savedDices = this.savedDices.filter((dice) => dice.id !== id);
  }

  select(player: PlayerIndex, section: Sections) {
    if (this.state !== 'playing') {
      throw new Error('Game is not started');
    }
    if (player !== this.currentPlayer) {
      throw new Error(`It is not Player ${player}'s turn`);
    }
    if (!this.rolled) {
      throw new Error('You must roll the dice first');
    }

    const diceValues = [
      ...this.boardDices.map((dice) => dice.value),
      ...this.savedDices.map((dice) => dice.value),
    ];
    const score = scoreFunctions[section](diceValues);
    if (!score) {
      throw new Error(`Score is invalid`);
    }
    this.players[player - 1].score[section] = score;

    // TODO: Update bonus

    // Change turn
    this.rolled = false;
    this.currentPlayer = getOpponent(this.currentPlayer);
    this.savedDices.forEach((dice) => this.boardDices.push(dice));
    this.savedDices = [];
  }

  toString(): string {
    return JSON.stringify({ type: 'game', payload: this });
  }
}
