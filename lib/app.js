const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const corsConfig = {
  origin: 'http://localhost:7891',
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.use('/api/auth', require('./controllers/auth.js'));
app.use('/api/notes', require('./controllers/notes.js'));
app.use('/api/tags', require('./controllers/tags.js'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
