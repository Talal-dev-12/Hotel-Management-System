const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║           🏨 LuxuryStay Hospitality API Server            ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running in ${config.NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Available Endpoints:');
  console.log('  • Auth:         /api/auth');
  console.log('  • Users:        /api/users');
  console.log('  • Rooms:        /api/rooms');
  console.log('  • Reservations: /api/reservations');
  console.log('  • Invoices:     /api/invoices');
  console.log('  • Tasks:        /api/tasks');
  console.log('  • Feedback:     /api/feedback');
  console.log('  • Reports:      /api/reports');
  console.log('');
  console.log('Press CTRL-C to stop');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});