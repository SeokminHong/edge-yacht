const isDev = process.env.NODE_ENV === 'development';
const httpProtocol = isDev ? 'http:' : 'https:';
const wsProtocol = isDev ? 'ws:' : 'wss:';
const apiHost = isDev ? 'localhost:8787' : 'yacht-api.seokmin.workers.dev';

export const getApi = (protocol: 'http' | 'websocket') =>
  `${protocol === 'http' ? httpProtocol : wsProtocol}//${apiHost}`;
