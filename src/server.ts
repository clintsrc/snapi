/*
 * Server
 *
 * Express server connects to mongodb and provides routes for the client to update
 * Users and Thoughts using the Social Network API
 *
 * Use a RESTful API tool as a frontend to interact with SNAPI (see the README)
 *
 */

import express from 'express';
import db from './config/connection.js';
import routes from './routes/index.js';

// connect to MongoDB
await db();

// Start the express server (use port 3001 by default)
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

// start accepting client connections
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
