import express from 'express';
const app = express();

require('dotenv').config();

app.set('port',  process.env.APP_PORT);
app.set('host',  process.env.APP_HOST);

export default app;