var fs = fs = require('fs');

module.exports = Database = {
	initModels : function(){
		// Bootstrap models
		var models_path = ROOT_PATH + '/app/models'
		var model_files = fs.readdirSync(models_path);
		model_files.forEach(function(file){
		    require(models_path+'/'+file)
		});
	},
	// initialize DB
	connectDB: function() {
	    var config_db = require(ROOT_PATH + '/config/database.json');
		config_db = config_db[ENV];
	    mongoose.connect(config_db.uri);
	    mongoose.set('debug', config_db.debug);
	    // Check connection to mongoDB
	    mongoose.connection.on('open', function() {
		    logger.debug('We have connected to mongodb');
		}); 
	    mongoose.connection.on('error', function(err) {
		    logger.debug('We have error while connecting to mongodb');
		}); 
	},
	// disconnect from database
	closeDB: function() {
	  	mongoose.disconnect();
	}
}