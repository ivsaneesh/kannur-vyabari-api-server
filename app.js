/*************************
author : @Fairusudheen
server starter script
*************************/

/********************************
include required modules and libraries
*********************************/
'use strict'

var express = require('express');
var path = require('path');
var compression = require('compression');
var cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
var helmet = require('helmet');
var moment = require('moment');
var app = express();
var logger = require('./logger/logger');

const session = require('express-session');
var redis_store = require('connect-redis')(session);
var cookie_parser = require('cookie-parser');
var timeout = require('connect-timeout');
const auth = require('./middleware/auth');
const fileUpload = require("express-fileupload");
var cluster = require('cluster')
var num_CPUs = require('os').cpus().length
app.use(compression());
app.use(helmet())

app.use(cookie_parser())

app.use(cors({ origin: '*', credentials: true }));
app.use(timeout('300s'));

/***********************************
Static content
************************************/
var one_day = 86400000;
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: one_day * 4 * 3
}));

//helpers
var utils = require('./helper/utils');
var sequelize = require('./helper/sequelize');
var mysqlHelper = require('./helper/mysqlHelper');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
app.set('port', process.env.PORT || 5090);

app.env_configs = utils.getConfigs(process.env.NODE_ENV);
app.set('mysql', new mysqlHelper(app));
app.set('sequelize', new sequelize(app));



/***********************************
application settings
************************************/
app.set('view engine', 'ejs');

app["root_dir"] = __dirname;


//http helper
var http_helper = require("./helper/httpManager");
app["http_manager"] = new http_helper();


app.use(function (req, res, next) {
    app.set('views', path.join(__dirname, 'views'));
    next();
});

app.use(express.json());

app.set('logger', new logger());

app.use(session({
    store: new redis_store({ host: app.env_configs['redis']['host'], port: app.env_configs['redis']['port'] }),
    secret: app.env_configs['redis']['secret'],
    resave: true,
    saveUninitialized: true
}));


/**************************
access logs with rotation
***************************/

/**************************
end access logs with rotation
***************************/
app.options('*', cors())

app.use(function (req, res, next) {
    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});
app.use(fileUpload());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.all('*', auth);
require('./routes/router')(app);
require('./routes/generic')(app);
require('./routes/status')(app);



module.exports = app;






/*****************************
Start service 
******************************/

if (process.env.NODE_ENV == "development") {

    if (cluster.isMaster && process.env.NODE_ENV != "development") {
        // Fork workers.
        for (var i = 0; i < num_CPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', function (worker, code, signal) {
            console.log('error', 'worker ' + worker.process.pid + ' died');
            cluster.fork();
        });
    } else {


        var server = app.listen(app.get('port'), function () {

            var host = server.address().address;
            var port = server.address().port;
            console.log('info', server.timeout, 'server.timeout')
            console.error('host', host);
            console.log('info', 'Server app listening at http://' + host + ':' + port + ', ENV : ' + process.env.NODE_ENV);

        });

    }
}


