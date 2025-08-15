import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Chat-specific Yjs doc and provider
export const chatYDoc = new Y.Doc();
export const chatProvider = new WebsocketProvider(
  'ws://localhost:1234', // Make sure this matches your y-websocket server
  'teamsync-chat',       // Unique room for chat
  chatYDoc
);

// Shared array for chat messages
export const chatYArray = chatYDoc.getArray('chat-messages');
