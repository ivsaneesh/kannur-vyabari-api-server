/**************************************
Usage examples
      var logger =   req.app.get('logger')
      logger.log("log test")
      logger.info("log info")
      logger.error("log error")
      logger.warn("log warn")


***************************************/

var chalk = require('chalk')
var winston = require('winston');

var enableConsoleLog = false;
const util = require('util');

 


var logger =  function(){
   var _this =  this;
   var transport;
   var transportError ;
   var wLogger;
   var path = require('path');

   this.log = function(message){
  	 if(enableConsoleLog)console.info(chalk.blue(message))
      this._log("info",message)
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

  this._log = function(level,message){
    var currentTime = new Date().toISOString();
    if (typeof message == "string"){
        this.wLogger.log(level, currentTime + " : " + message);
    }
    else{
      this.wLogger.log(level, currentTime + " : " ,message);
    }
  }

  //set the logs


  this.configure = function(log_path,service){
    require('winston-daily-rotate-file');
    //log rotator
    this.transport = new (winston.transports.DailyRotateFile)({
      filename: path.join(log_path,"application-%DATE%.log"),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    });
   this.transportError = new (winston.transports.DailyRotateFile)({
      filename: path.join(log_path,"application-error-%DATE%.log"),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level:'warn'
    });
    this.transport.on('rotate', function(oldFilename, newFilename) {
      
    });

    //winston logger
    this.wLogger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: service ? service : "SERVER" },
      transports: [this.transport,this.transportError]
    });


    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    // 
    if (process.env.NODE_ENV !== 'production') {
      this.wLogger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }
  }
  


}

module.exports =  logger;

