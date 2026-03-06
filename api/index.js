const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../backend/config/db');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Serve uploaded files statically with CORS headers - NO AUTH NEEDED
const uploadsPath = path.join(__dirname, '..', 'backend', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Serve files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, path) => {
    res.set('Content-Disposition', 'inline');
  }
}));

// Handle direct file access - NO AUTH NEEDED
app.get(/^\/files-.*\.\w+$/, (req, res) => {
  const filename = req.path.substring(1);
  const filePath = path.join(uploadsPath, filename);
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// Import routes
const userRoutes = require('../backend/routes/userRoutes');
const criteriaRoutes = require('../backend/routes/criteriaRoutes');
const documentRoutes = require('../backend/routes/documentRoutes');
const submissionRoutes = require('../backend/routes/submissionRoutes');
const evaluationRoutes = require('../backend/routes/evaluationRoutes');
const schoolRoutes = require('../backend/routes/schoolRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/criteria', criteriaRoutes);
app.use('/criteria', criteriaRoutes);

app.use('/api/documents', documentRoutes);
app.use('/documents', documentRoutes);

app.use('/api/submissions', submissionRoutes);
app.use('/submissions', submissionRoutes);

app.use('/api/evaluations', evaluationRoutes);
app.use('/evaluations', evaluationRoutes);

app.use('/api/schools', schoolRoutes);
app.use('/schools', schoolRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error('[ERROR]', err.message);
  if (err.stack) console.error(err.stack);
  res.status(status).json({ message: err.message || 'Server error' });
});

// Export for Vercel
module.exports = app;
