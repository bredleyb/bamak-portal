export function createCorsOptions(webUrl?: string) {
  return {
    origin: webUrl ?? 'http://localhost:3000',
    credentials: true,
  };
}