type Env = {
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH_STORE: KVNamespace;
  SALT: string;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request);
  },
};

async function handleRequest(request: Request) {
  // This proxies your Pages application under the condition that your Worker script is deployed on the same custom domain as your Pages project
  const response = await fetch(request);

  // Clone the response so that it is no longer immutable
  const newResponse = new Response(response.body, response);

  // Add a custom header with a value
  newResponse.headers.append(
    'x-workers-hello',
    'Hello from Cloudflare Workers'
  );

  // Adjust the value for an existing header
  newResponse.headers.set('x-header-to-change', 'NewValue');

  return newResponse;
}
