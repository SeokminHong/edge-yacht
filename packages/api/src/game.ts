import {
  PlayerIndex,
  Player,
  Dice,
  Sections,
  scoreFunctions,
  EMPTY_SCORE,
  rollDice,
} from 'shared';

export type GameState = 'waiting' | 'playing' | 'finished';

export class Game {
  state: GameState;
  currentPlayer: PlayerIndex;
  boardDices: Dice[];
  savedDices: Dice[];
  players: Player[];

  constructor() {
    this.state = 'waiting';
    this.currentPlayer = 1;
    this.boardDices = [
      { id: 1, value: 1 },
      { id: 2, value: 1 },
      { id: 3, value: 1 },
      { id: 4, value: 1 },
      { id: 5, value: 1 },
    ];
    this.savedDices = [];
    this.players = [
      { id: 1, score: EMPTY_SCORE },
      { id: 2, score: EMPTY_SCORE },
    ];
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

    const diceValues = [
      ...this.boardDices.map((dice) => dice.value),
      ...this.savedDices.map((dice) => dice.value),
    ];
    const score = scoreFunctions[section](diceValues);
    if (!score) {
      throw new Error(`Score is invalid`);
    }
    this.players[player].score[section] = score;

    // TODO: Update bonus
  }

  toString(): string {
    return JSON.stringify({ type: 'game', payload: this });
  }
}
