export {};

declare global {
  interface Response {
    readonly webSocket?: WebSocket | null;
  }
}
