var express = require('express');
var cors = require('cors');

var app = express();
var bodyParser = require('body-parser');
var models = require('./models');

const listingRouter = require('./routes/listing-router');
const chatRouter = require('./routes/chat-router');
const userRouter = require('./routes/user-router');

const configureServer = () => {

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(cors());    
    app.use('/listings', listingRouter);
    app.use('/messages', chatRouter);
    app.use('/users', userRouter);

    app.listen(5000, '127.0.0.1', () => {
        console.log('Server is started on 127.0.0.1:5000');
    });
}

models.sequelize.sync().then(() => {
    configureServer();
})