/**************************************
Logger generic class 
Author:Fairusudheen
Usage examples
      var logger =   req.app.get('logger')
      logger.log("log test")
      logger.info("log info")
      logger.error("log error")
      logger.warn("log warn")


***************************************/

var chalk = require('chalk')
var winston = require('winston');
require('winston-daily-rotate-file');
var enableConsoleLog = true;

//log rotator
var transport = new (winston.transports.DailyRotateFile)({
    filename: 'logger/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });
 var transportError = new (winston.transports.DailyRotateFile)({
    filename: 'logger/application-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level:'warn'
  });
  transport.on('rotate', function(oldFilename, newFilename) {
    
  });

//winston logger
const wLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [transport,transportError]
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    /*new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]*/
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  wLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

var logger =  function(){
   var _this =  this;
   this.log = function(message){
  	 if(enableConsoleLog)console.log(chalk.blue(message))
      this._log("silly",message)
   }
   this.info = function(message){
  	 if(enableConsoleLog)console.info(chalk.green(message))
     this._log("info",message)
   }
   this.error = function(message){
  	 if(enableConsoleLog)console.error(chalk.red(message))
     this._log("error",message)
   }
   this.warn = function(message){
  	 if(enableConsoleLog)console.warn(chalk.rgb(244, 122, 66)(message))
     this._log("warn",message)
   }

  this._log = function(type,message){
    var currentTime = new Date().toISOString();
    wLogger.log(type, message);
  }

}

module.exports =  logger;

