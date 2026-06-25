const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient();

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174',
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Make prisma and io accessible in routes
app.locals.prisma = prisma;
app.locals.io = io;

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { postCommentRouter, commentRouter } = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const newsRoutes = require('./routes/newsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);           // CRUD for posts
app.use('/api/posts', postCommentRouter);    // /api/posts/:postId/comments
app.use('/api/posts', likeRoutes);           // /api/posts/:postId/like
app.use('/api/comments', commentRouter);     // /api/comments/:id (delete)
app.use('/api/users', userRoutes);           // User profiles + search
app.use('/api/friends', friendRoutes);       // Friend requests + friends list
app.use('/api/notifications', notificationRoutes); // Notifications
app.use('/api/news', newsRoutes);               // News feed

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User comes online
  socket.on('user:online', (userId) => {
    socket.userId = userId;
    console.log(`User ${userId} is online`);
  });

  // Join conversation room
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  // Leave conversation room
  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Export for testing
module.exports = { app, server, prisma, io };
