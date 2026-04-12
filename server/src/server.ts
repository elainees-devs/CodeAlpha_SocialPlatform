import { connectDB } from "./config";


connectDB().then(() => {
  const app = require('./app').default;

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});