// Convert http/https URLs to ws/wss URLs
const convertToWebSocketURL = (url: string) => {
  if (process.env.NODE_ENV === 'development') {
    return 'ws://localhost:8081';
  }
  
  // For production
  if (!url) {
    throw new Error('NEXT_PUBLIC_WEBSOCKET_URL environment variable is not set');
  }
  
  return url.replace('https://', 'wss://').replace('http://', 'ws://');
};

export const WEBSOCKET_URL = convertToWebSocketURL(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '');
