import express from 'express';
import db from './config/connection.js';
import routes from './routes/index.js';

await db();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
