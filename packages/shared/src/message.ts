import { PlayerIndex, PlayerInfo } from './player';
import { IGame } from './game';

export type PayloadTypes = {
  error: {
    message: string;
  };
  health: {
    index: PlayerIndex;
  };
  start: {
    playerIndex: PlayerIndex;
    game: IGame;
    myInfo: PlayerInfo;
    opponentInfo: PlayerInfo;
  };
  update: {
    game: IGame;
  };
};

export type ActionTypes = keyof PayloadTypes;

export type DataType<T extends keyof PayloadTypes = keyof PayloadTypes> = {
  type: T;
  payload: PayloadTypes[T];
};

export const isError = (data: DataType): data is DataType<'error'> =>
  data.type === 'error';

export const isHealth = (data: DataType): data is DataType<'health'> =>
  data.type === 'health';

export const isStart = (data: DataType): data is DataType<'start'> =>
  data.type === 'start';

export const isUpdate = (data: DataType): data is DataType<'update'> =>
  data.type === 'update';
