
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');

const websocketServer = require('./services/websocketServer');

const summarizeRoutes = require('./routes/summarizeRoutes');


const app = express();
app.use(cors());
app.use(express.json());

// Import auth middleware
const authMiddleware = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/summarize', summarizeRoutes);




// Example of a protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

// MongoDB connection
const MONGO_URI = process.env.ATLAS_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/teamsync';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
	res.send('TeamSync backend running');
});

const server = http.createServer(app);
websocketServer(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
