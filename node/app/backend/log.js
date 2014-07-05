 /*var winston = require("winston"),
 	date = require("./utils")
 	, formattedDate = date.dateFormat(new Date(), "%Y_%m_%d", true);

 var logger = new (winston.Logger)({
    transports: [
      new winston.transports.File({ filename: ROOT_PATH + app_config.logPath + '/debug_'+formattedDate+'.log', json : false })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: ROOT_PATH + app_config.logPath + '/debug_'+formattedDate+'.log', json : false })
    ]
  });*/
  var logger = {};
  
  //For new version - 0.7.2
  logger.debug = function(){
  	console.log("info", arguments);
  	
  }
  logger.log = function(){
  	console.log("info", arguments);
  	
  }
  logger.info = function(){
  	console.log("info", arguments);
  	
  }
  logger.error = function(){
  	console.log("info", arguments);
  	
  }

  module.exports = logger;