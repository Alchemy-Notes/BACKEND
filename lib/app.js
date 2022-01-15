const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', require('./controllers/auth.js'));
app.use('/api/notes', require('./controllers/notes.js'));
app.use('/api/tags', require('./controllers/tags.js'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
