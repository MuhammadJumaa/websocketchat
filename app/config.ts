// Convert http/https URLs to ws/wss URLs
const convertToWebSocketURL = (url: string) => {
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'ws://localhost:8081';
  }
  
  // For production, use the environment variable or fallback to the Render URL
  const wsUrl = url || 'https://websocket-chat-server-96kx.onrender.com';
  return wsUrl.replace('https://', 'wss://').replace('http://', 'ws://');
};

export const WEBSOCKET_URL = convertToWebSocketURL(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '');
