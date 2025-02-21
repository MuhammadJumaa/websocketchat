// Convert http/https URLs to ws/wss URLs
const convertToWebSocketURL = (url: string) => {
  // For local development
  if (!url || url.includes('localhost')) {
    return 'ws://localhost:8081';
  }
  // For production (Render)
  return url.replace('https://', 'wss://').replace('http://', 'ws://');
};

export const WEBSOCKET_URL = convertToWebSocketURL(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '');
