import {
  PlayerIndex,
  Player,
  Dice,
  Sections,
  scoreFunctions,
  EMPTY_SCORE,
} from 'shared';

export type GameState = 'waiting' | 'started' | 'finished';

export class Game {
  state: GameState;
  turn: PlayerIndex;
  boardDices: Dice[];
  savedDices: Dice[];
  players: Player[];

  constructor() {
    this.state = 'waiting';
    this.turn = 1;
    this.boardDices = [
      new Dice(1, 1),
      new Dice(2, 1),
      new Dice(3, 1),
      new Dice(4, 1),
      new Dice(5, 1),
    ];
    this.savedDices = [];
    this.players = [
      { id: 1, score: EMPTY_SCORE },
      { id: 2, score: EMPTY_SCORE },
    ];
  }

  start() {
    this.state = 'started';
  }

  roll(player: PlayerIndex) {
    if (this.state !== 'started') {
      throw new Error('Game is not started');
    }
    if (player !== this.turn) {
      throw new Error(`It is not Player ${player}'s turn`);
    }

    this.boardDices.forEach((dice) => dice.roll());
  }

  save(player: PlayerIndex, id: number) {
    if (this.state !== 'started') {
      throw new Error('Game is not started');
    }
    if (player !== this.turn) {
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
    if (this.state !== 'started') {
      throw new Error('Game is not started');
    }
    if (player !== this.turn) {
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
    if (this.state !== 'started') {
      throw new Error('Game is not started');
    }
    if (player !== this.turn) {
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
}
