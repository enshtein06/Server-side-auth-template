// Main startinh poinh of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();

// DB Setup
mongoose.connect('mongodb://localhost:27017');

// App setup

// Morgan is login framework
// it's mostly using for developing process and debuggin
app.use(morgan('combined'));
// bodyParser using to parse the request specificly json 
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server setup

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => console.log(`Server listening on port ${port}`))