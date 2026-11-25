
import serverless from 'serverless-http';
import app from '../../server/index.js';
import { connectDB } from '../../server/db.js';

const expressHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    return await expressHandler(event, context);
  } catch (error) {
    console.error('API error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
