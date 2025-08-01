import { createApp } from './app.js';

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    const app = createApp();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 tRPC endpoint: http://localhost:${PORT}/trpc`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();