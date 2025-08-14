TeamSync Collab Suite
Real-Time Team Brainstorming & AI-Powered Action Tracking

<!-- optional: replace with actual image -->

📌 Overview
TeamSync Collab Suite is a real-time collaborative whiteboard and note-taking platform that helps distributed teams brainstorm, sketch, and ideate together.
Powered by CRDTs for smooth concurrent editing and AI for live summarization, it automatically turns raw session notes into actionable tasks.

🚀 Features
💡 Real-Time Collaboration
Multi-user live editing with WebRTC/WebSocket and CRDTs (Yjs)

Seamless conflict-free updates without overwriting other users’ work

Undo/redo powered by CRDT history tracking

🖌️ Interactive Canvas
Freehand drawing, sticky notes, and text editing

Drag-and-drop reordering

Infinite zoom & pan

🤖 AI Assistance
Live session summarization with OpenAI API

Prompt-driven idea suggestions

Auto-conversion of notes into actionable tasks

🔐 Advanced Permissions
Role-based access control (owner, editor, viewer)

Document sharing with secure links

Session history and version control

📋 Task Integration
Integrated Kanban task board

Assign action items to team members

Export tasks to CSV or project management tools


🛠️ Tech Stack

/TeamSync
  /client
    /public
    /src
      /components
        CanvasBoard.jsx       # Collaborative drawing canvas
        TaskBoard.jsx         # Kanban-style task board
        AIControls.jsx        # AI summarization & prompt UI
        AuthProvider.jsx      # Auth context and hooks
      /utils
        yjs-setup.js          # CRDT setup with Yjs
        websocket.js          # WebSocket connection logic
        ai.js                 # AI API requests & formatting
      App.jsx
      index.js
    package.json
  /server
    /src
      /controllers
        documentController.js # Handles document CRUD & sync
        taskController.js     # Task CRUD & assignment logic
        authController.js     # OAuth login & JWT handling
      /models
        Document.js           # Document schema
        Task.js               # Task schema
        User.js               # User schema
      /routes
        documentRoutes.js     # REST routes for docs
        taskRoutes.js         # REST routes for tasks
        authRoutes.js         # Auth routes
      /services
        websocketServer.js    # Real-time communication server
        aiService.js          # AI summarization & tasks
        crdtService.js        # Yjs CRDT doc handling
      app.js
    package.json
  /infra
    Dockerfile
    docker-compose.yml
    k8s-deployment.yaml
    github-actions.yml
  README.md
