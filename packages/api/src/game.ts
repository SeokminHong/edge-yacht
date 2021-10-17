import {
  GameState,
  IGame,
  DEFAULT_GAME,
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
    this.state = DEFAULT_GAME.state;
    this.currentPlayer = DEFAULT_GAME.currentPlayer;
    this.boardDices = DEFAULT_GAME.boardDices;
    this.savedDices = DEFAULT_GAME.savedDices;
    this.players = DEFAULT_GAME.players;
    this.rolled = DEFAULT_GAME.rolled;
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

  changeTurn() {
    this.rolled = false;
    this.currentPlayer = getOpponent(this.currentPlayer);
  }

  toString(): string {
    return JSON.stringify({ type: 'game', payload: this });
  }
}
