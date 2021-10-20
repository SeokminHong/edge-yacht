export const toWebsocketUrl = (url: string) => {
  // Valid websocket URL
  if (url.startsWith('ws')) {
    return url;
  }
  // Relative URL
  if (url.startsWith('/')) {
    const protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
    return `${protocol}//${window.location.host}${url}`;
  }
  // Absolute URL
  return url.replace(/^http(s)?/, 'ws$1');

  // Do not consider other protocols
};
