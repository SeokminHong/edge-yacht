import { PlayerIndex } from './player';
import { IGame } from './game';
import { User } from './user';

export type Payload = {
  error: {
    message: string;
  };
  health: {
    index: number;
  };
  start: {
    playerIndex: PlayerIndex;
    game: IGame;
    users: (User | undefined)[];
  };
  update: {
    game: IGame;
  };
  end: {
    result: 'win' | 'lose' | 'draw';
  };
};

export type Message = keyof Payload;

export type DataType<T extends keyof Payload = keyof Payload> = {
  type: T;
  payload: Payload[T];
};

export const isError = (data: DataType): data is DataType<'error'> =>
  data.type === 'error';

export const isHealth = (data: DataType): data is DataType<'health'> =>
  data.type === 'health';

export const isStart = (data: DataType): data is DataType<'start'> =>
  data.type === 'start';

export const isUpdate = (data: DataType): data is DataType<'update'> =>
  data.type === 'update';

export const isEnd = (data: DataType): data is DataType<'end'> =>
  data.type === 'end';
