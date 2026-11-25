
import './env.js';
import { connectDB } from './db.js';
import app from './index.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not start:', err.message);
    process.exit(1);
  });
