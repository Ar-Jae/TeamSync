# TeamSync Collab Suite


## Project Setup

- Uses React (latest) for the client UI
- Uses Node.js/Express for the backend
- Real-time collaboration planned with Yjs/CRDTs
- AI features (OpenAI integration) planned
- MongoDB for persistence

## Development

### Client
- Install dependencies: `npm install` (in `client`)
- Start dev server: `npm run dev` (in `client`)
- Uses React 19 and `react-scripts`


### Server
- Install dependencies: `npm install` (in `server`)
- Start dev server: `npm run dev` (in `server`, uses nodemon for hot reload)
- Uses MongoDB Atlas (set `ATLAS_URL` in `server/.env`)
- Loads environment variables with `dotenv`

## Recent Changes
- Upgraded React and ReactDOM to latest (19.x)
- Added `dev` script for client and server
- Fixed missing `public/index.html`
- Initialized git and pushed to GitHub
- Connected backend to MongoDB Atlas using .env
- WebSocket server enabled for real-time features
- Implemented real-time collaboration using Yjs/CRDTs
- Added AI features with OpenAI integration (AI-assisted text, task suggestions)
- Created collaborative text editor and Kanban/task boards
- Added authentication (JWT-based) and user management
- Integrated WebSocket server for document and task sync
- Modularized backend with controllers, services, and middleware
- Added Docker and Kubernetes deployment configs
- Improved error handling and environment variable management
- Enhanced frontend UI/UX and component structure

- Unified login/register flow using a single `AuthForm` component as the entry gate
- Refactored frontend so users see only AuthForm until authenticated, then main app
- Added firstName and lastName to user model and profile API
- Fixed JWT secret and user lookup bugs in backend auth middleware
- Improved `/api/users/me` to return all user fields except password
- Cleaned up App.jsx to remove custom login/register logic and use AuthForm for all auth

## Key Concepts

**WebSocket:** Enables real-time, two-way communication between client and server for collaborative features.

**Webpack:** Bundles and optimizes frontend assets (JS, CSS, etc.) for efficient delivery in production React apps.
