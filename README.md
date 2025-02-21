# WebSocket Chat Application

A real-time chat application built with Next.js and WebSocket.

## Project Structure

- `/` - Next.js frontend application
- `/server` - WebSocket server

## Deployment Instructions

### WebSocket Server Deployment

1. Deploy the WebSocket server to a hosting service that supports WebSocket (e.g., Heroku, DigitalOcean, etc.)
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment (Vercel)

1. Create a new project on Vercel and connect it to your GitHub repository
2. Add the following environment variable in your Vercel project settings:
   - `NEXT_PUBLIC_WEBSOCKET_URL`: Your WebSocket server URL (e.g., `wss://your-websocket-server.herokuapp.com`)
3. Deploy the project

## Local Development

1. Start the WebSocket server:
   ```bash
   cd server
   npm install
   npm start
   ```

2. In a new terminal, start the Next.js development server:
   ```bash
   npm install
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

## Environment Variables

- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket server URL
  - Local development: `ws://localhost:8081`
  - Production: `wss://your-websocket-server.domain.com`
