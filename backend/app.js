const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/user');
const msgRoutes = require('./routes/message')
const comRoutes = require('./routes/comment')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Body Parser configuration
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/user', userRoutes);
app.use('/api/message', msgRoutes)
app.use('/api/comment', comRoutes)

module.exports = app;