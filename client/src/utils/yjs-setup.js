import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Create a Yjs document
export const ydoc = new Y.Doc();

// Connect to a y-websocket server (default demo server for now)
export const provider = new WebsocketProvider(
	'ws://localhost:1234', // Local y-websocket server
	'teamsync-room',       // Room name for collaboration
	ydoc
);

// Shared data structure (e.g., for text or canvas state)
export const yarray = ydoc.getArray('shared-data');
