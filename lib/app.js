const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./controllers/auth.js'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

// Comment so heroku will push
