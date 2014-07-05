var Validator 	= require('validator').Validator, utils 	= require('../backend/utils'),
    crypto 		= require('crypto');

var exports = module.exports = UserSchema = new mongoose.Schema({});

UserSchema.add({
    uid: 					{type: String, default : '', index: true, unique : true },
    email:      			{type: String, index: true, unique: true },
    provider:      			{type: String, index: true, unique: false },
	password: 				{type: String },
  	activated:  			{type: Boolean, default: true },
    displayName: 		    {type: String, default : '', index: true },
    username: 				{type: String, default : '', required : true, index: true },
  	firstname: 				{type: String, default : '', required : false, index: true },
  	lastname: 				{type: String, default : '', required : false, index: true },
  	created_at: 			{type: Date, default: Date.now },
    accessToken: 		    {type: String, default : '', index: false },
    expires: 			    {type: String, default : '', index: false },
    link: 				    {type: String, default : '', index: false },
    picture: 			    {type: String, default : '', index: true },
    gender: 				{type: String, default : '', index: false },
    time_zone: 			    {type: String, default : '', index: false },
    lang: 				    {type: String, default : '', index: false },
    locale: 				{type: String, default : '', index: false },
    birthdate: 			    {type: Date},
    phone : 				{type: String, default : '', index: false},
    /* From twitter */
    statuses_count:  	    {type: Number, required : false, index: false },
    screen_name: 		    {type: String, default : '', index: true },
    followers_count:        {type: Number, required : false, index: false },
    description: 		    {type: String, default : '', index: false },
    friends_count: 	        {type: Number, required : false, index: false },
    /* From facebook and twitter */
    location: {
    	address: {type: String, default : '', index: true },
        latitude : {type: Number, default : '', index: true},
        longitude : {type: Number, default : '', index: true}
    },
    hometown: {
        name: 			    {type: String, default : '', index: true }
    },
    /* From LinkedIn */
    associations: 		    {type: String, default : '', index: false },
    headline: 			    {type: String, default : '', index: false },
    honors: 			    {type: String, default : '', index: false },
    industry: 			    {type: String, default : '', index: false },
    interests: 			    {type: String, default : '', index: false },
    numConnections: 	    {type: Number, default : '', index: false },
    numRecommenders: 	    {type: String, default : '', index: false },
    specialties: 		    {type: String, default : '', index: false },
    summary: 			    {type: String, default : '', index: false },
    deviceId: 			    {type: String, default : '', index: false },
    deviceType: 			{type: String, default : '', index: false },
});
/** 
 * Find user by id
 * @static
 */
UserSchema.statics.findUserById = function (id, callback) {
	this.findOne({_id: id}, callback);
};
/** 
 * Find user by api key
 * @static
 */
UserSchema.statics.findByApiKey = function (apikey, fn) {console.log(apikey.apikey);
	this.findOne({_apiKey: apikey.apikey}, fn);
//	for (var i = 0, len = users.length; i < len; i++) {
//	    var user = users[i];
//	    if (user.apikey === apikey) {
//	      return fn(null, user);
//	    }
//	  }
//	  return fn(null, null);
};
/**
 * Verify Password
 * @static
 */
UserSchema.statics.verifyPassword = function (password, user) {
    return user.password == password;
};

/**
 * Authenticate user 
 *
 * @api static
 */
UserSchema.statics.login = function(email, password, callback) {
	var User = mongoose.model('User');
	
	this.findOne({ email: email}, function (err, user) {
		if (err) callback(err, null);
		if(user) {

			if (user.email && user.password === User.sign(password, 'md5')) {
				callback(err, user);
			} else {
				callback(null, null);
			}

		} else {
			callback(null, null);
		}
	});
};

/**
 * Encode string with hash method sha1 or md5
 *
 * @api static
 * @todo move to utils
 */
UserSchema.statics.sign = function(str, hash) {
	return require('crypto').createHash(hash).update(str.toString()).digest('hex');	
};

/**
 * Register user (not used)
 *
 * @api static
 */
UserSchema.statics.register = function(data, callback) {
	var User = mongoose.model('User');
	var user = new User();
    User.findOne({email:data.username}, function(err, user) {
        if(err){
            callback(err);
        }else
        if (user){
            //callback(err, user);
            callback('USER_EXISTS');
        }	else{
            User.saltAndHash(data.password, function(hash){
                // append date stamp when record was created //
                //newData.date = Date.now();
                //User.insert({"email" : data.username, "password" : hash }, {safe: true}, callback);
                var user = new User();
                //user.uid 			= gData.id;
                user.email 		= data.username;
                user.password = hash;
                user.username 		= data.username;
                user.activated 			= false;
                user.provider 			= "M";//My Cards

                user.save(function (err, savedUser) {
                    if (err) {
                        console.log("Couldnt save new user: " + err);
                        callback(err);
                        return;
                    } else {
                        console.log("User '" + data.email + "' created: ");
                        callback(null, savedUser);
                    }
                });
            });

        }
    });

}

/* private encryption & validation methods */

UserSchema.statics.generateSalt = function()
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

UserSchema.statics.md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

UserSchema.statics.saltAndHash = function(pass, callback)
{
    var salt = this.generateSalt();
    callback(salt + this.md5(pass + salt));
}

UserSchema.statics.validatePassword = function(plainPass, hashedPass, callback)
{
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + this.md5(plainPass + salt);
    return (hashedPass === validHash);
}
/**
 * Validate user form when create or update
 *
 * @api static
 */
UserSchema.statics.validateUser = function(req) {
	req.assert(['User', 'email'], 'Please enter a valid Email').isEmail();		
  	req.assert(['User', 'username'], 'Please enter a Username').notEmpty();
  	req.assert(['User', 'firstname'], 'Please enter a Firstname.').notEmpty();
  	req.assert(['User', 'lastname'], 'Please enter a Lastname.').notEmpty();	
  	req.assert(['User', 'gender'], 'Please fill out gender.').notEmpty();	
	return req.validationErrors();
};

/**
 * Update user
 *
 * @api static
 */
UserSchema.methods.updateAll = function(user, callback) {
	var User = mongoose.model('User');
	this.username 		= user.username;
	this.firstname 	= user.firstname;
	this.lastname 		= user.lastname;
	this.email 			= user.email;
	this.gender			= user.gender;
	this.activated 	= (typeof user.activated === "undefined" ? false : true);
	
	this.save(callback);					// save the user		
};

/** 
 * Update Authentication Google Data with google openid + oauth2
 * @static
 */
UserSchema.statics.findOrCreateByGoogleData = function(accessToken, accessTokenExtra, gData, done) {
	
	//utils.var_dump(gData);
	var User = mongoose.model('User');

	this.findOne({'uid': gData.id}, function (err, user) {
		
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
            done(err);
			return;
			
		} else if (user) {
			console.log("User " + gData.email + " found and logged in.");
            done(null, user);
		} else {
            gProfileData = gData._json;
			var expiresDate = utils.getExpiresDate();
		  	var user = new User();
		  	var datas = {};
			var birthdate = gProfileData.birthday ? new Date(gProfileData.birthday) : "";

			user.uid 			= gData.id;
			user.accessToken = accessToken;
			user.expires 		= expiresDate;
			user.displayName 			= gProfileData.name;
			user.firstname 	= utils.capitaliseFirstLetter(gProfileData.given_name);
			user.lastname 	= utils.capitaliseFirstLetter(gProfileData.family_name);
			user.link 			= gProfileData.link;
			user.picture 		= gProfileData.picture;
			user.locale 		= gProfileData.locale;
			user.email 		= gProfileData.email;
			user.birthdate 	= birthdate;
			user.username 				= gProfileData.name;
			user.gender 				= (gProfileData.gender == 'male' ? 'M' : 'F');
			user.photo 					= gProfileData.picture;
			user.activated 			= true;
            user.provider 			= "G";

			user.save(function (err, savedUser) {
				if (err) {
					console.log("Couldnt save new user: " + err);
                    done(err);
					return;
				} else {
					console.log("User '" + gData.email + "' created: ");
                    done(null, savedUser);
				}
			});

		}
	});
  
};


/** 
 * Update Authentication Facebook Data with oauth
 * @static
 */
UserSchema.statics.findOrCreateByFacebookData = function (accessToken, fbUserMetadata, done) {
	try{
	//utils.var_dump(fbUserMetadata);
	var User = mongoose.model('User');
	logger.log("info", "inside User.findOrCreateByFacebookData", [accessToken, fbUserMetadata]);	
	this.findOne({'uid': fbUserMetadata.id}, function (err, user) {
		
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
            done(err);
			return;
			
		} else if (user) {
			console.log("User " + fbUserMetadata.email + " found and logged in.");
            done(null,user);
            
			User.update({'uid': fbUserMetadata.id}, fbUserMetadata, {upsert: false}, function (err, user) {
            	if(err)
					logger.log("info", "In findOrCreateByFacebookData: error saving existing user: ", err);
			});
			
		} else {
//			var fullProfileData = fbUserMetadata;//fbUserMetadata._json;console.log(fbUserMetadata);
			logger.log("info", "user.findOrCreateByFacebookData", fbUserMetadata);
			var expiresDate = utils.getExpiresDate();
		  	var user = new User();
			var birthdate = new Date(fbUserMetadata.birthday);
         
			user.uid 				= fbUserMetadata.id;
			user.accessToken	= accessToken;
			user.expires		= expiresDate;
			user.displayName 			= fbUserMetadata.displayName;
			user.firstname		= utils.capitaliseFirstLetter(fbUserMetadata.first_name);
			user.lastname		= utils.capitaliseFirstLetter(fbUserMetadata.last_name);
			user.link			= fbUserMetadata.profileUrl;
			user.picture		= fbUserMetadata.picture;
			user.birthdate		= birthdate;
			user.locale			= fbUserMetadata.locale;
			user.verified		= fbUserMetadata.verified;
			user.email			= fbUserMetadata.email;
			user.relationship_status = fbUserMetadata.relationship_status;
			user.location.name = (fbUserMetadata.location ? fbUserMetadata.location.name : "");
			user.location.latitude = (fbUserMetadata.location ? fbUserMetadata.location.latitude : null);
			user.location.longitude = (fbUserMetadata.location ? fbUserMetadata.location.longitude : null);
			user.hometown.name = (fbUserMetadata.hometown ? fbUserMetadata.hometown.name : "");
			user.username					= fbUserMetadata.username;
			user.gender						= (fbUserMetadata.gender == 'male' ? 'm' : 'f');
			user.photo						= fbUserMetadata.picture;
			user.activated 				= true;
            user.deviceId 				= fbUserMetadata.deviceId;
            user.deviceType 				= fbUserMetadata.deviceType;
            

			user.save(function (err, savedUser) {
				if (err) {
					console.log("Couldnt save new user: " + err);
                    done(err);
					return;
				} else {
					console.log("User '" + fbUserMetadata.email + "' created: ");
                    done(null, savedUser);
				}
			});
		}
	
	});	
	}catch(err){
		logger.log("error", err);
	}
};

/** 
 * Update Authentication Twitter Data with oauth2
 * @static
 */
UserSchema.statics.findOrCreateByTwitterData = function (twitterUserMetadata, accessToken, accessTokenExtra, promise) {

	//utils.var_dump(twitterUserMetadata);
	var User = mongoose.model('User');	

	this.findOne({'twitter.id': twitterUserMetadata.id}, function (err, user) {
	
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
			promise.fail(err);
			return;
	
		} else if (user) {
			console.log("User " + twitterUserMetadata.id + " found and logged in.");
			promise.fulfill(user);
	
		} else {
	
		  	var expiresDate = utils.getExpiresDate();
		  	var user = new User();
			
		  	user.twitter.id 					= twitterUserMetadata.id;
		  	user.twitter.accessToken		= accessToken;
		  	user.twitter.expires				= expiresDate;
		  	user.twitter.statuses_count	= twitterUserMetadata.statuses_count;
		  	user.twitter.name					= twitterUserMetadata.name;
		  	user.twitter.screen_name		= twitterUserMetadata.screen_name;
		  	user.twitter.picture				= twitterUserMetadata.profile_image_url;
		  	user.twitter.locale				= twitterUserMetadata.locale;
		  	user.twitter.followers_count	= twitterUserMetadata.followers_count;
		  	user.twitter.description		= twitterUserMetadata.description;
		  	user.twitter.link					= twitterUserMetadata.url;
		  	user.twitter.created_at			= twitterUserMetadata.created_at;
		  	user.twitter.friends_count		= twitterUserMetadata.friends_count;
		  	user.twitter.location			= twitterUserMetadata.location;
		  	user.twitter.time_zone			= twitterUserMetadata.time_zone;
		  	user.twitter.lang					= twitterUserMetadata.lang;
		  	user.username						= twitterUserMetadata.screen_name;
		  	user.photo							= twitterUserMetadata.profile_image_url;
		  	user.gender							= 'm';
		  	user.activated 					= true;
			
		  	user.save(function (err, savedUser) {
		     	if (err) {
		  			console.log("Couldnt save new user: " + err);
		  			promise.fail(err);
		  			return;
		  		} else {
		  			console.log("User '" + twitterUserMetadata.id + "' created: ");
		  			promise.fulfill(savedUser);
		  		}
		  	});
		}	
	});	
};
UserSchema.statics.findUsers = function(query, fields, callback){
	this.find(query, fields, function (err, users) {
		callback(err, users);
	});
}
/** 
 * Update Authentication Linkedin Data with oauth2
 * @static
 */
UserSchema.statics.findOrCreateByLinkedinData = function (accessToken, accessTokenExtra, linkedinUserMetadata, done) {
	//utils.var_dump(linkedinUserMetadata);
	var User = mongoose.model('User');
	
	this.findOne({'uid': linkedinUserMetadata.id}, function (err, user) {
	
		if (err) {
			console.log("Error in finding user for auth. Check Db.");
            done(err);
			return;
	
		} else if (user) {
			console.log("User " + linkedinUserMetadata.id + " found and logged in.");
            done(null, user);
	
		} else {
	        var fullProfileData = linkedinUserMetadata._json;
				var expiresDate = utils.getExpiresDate();
				var user = new User();
            var birthdate = new Date(fullProfileData.birthday);

            user.uid 				= linkedinUserMetadata.id;
            user.accessToken	= accessToken;
            user.expires		= expiresDate;
            user.displayName 			= linkedinUserMetadata.displayName;
            user.firstname		= utils.capitaliseFirstLetter(fullProfileData.firstName);
            user.lastname		= utils.capitaliseFirstLetter(fullProfileData.lastName);
            user.link			= linkedinUserMetadata.profileUrl;
            user.picture		= linkedinUserMetadata.picture;
            user.birthdate		= birthdate;
            user.locale			= fullProfileData.locale;
            user.verified		= fullProfileData.verified;
            user.email			= fullProfileData.email;
            user.relationship_status = fullProfileData.relationship_status;
            user.location.name = (fullProfileData.location ? fullProfileData.location.name : "");
            user.hometown.name = (fullProfileData.hometown ? fullProfileData.hometown.name : "");
            user.username					= linkedinUserMetadata.username;
            user.gender						= (linkedinUserMetadata.gender == 'male' ? 'm' : 'f');
            user.activated 				= true;
            user.provider 				= "L";

            	user.associations				= linkedinUserMetadata.associations;
				user.headline					= linkedinUserMetadata.headline;
				user.honors					= linkedinUserMetadata.honors;
				user.industry					= linkedinUserMetadata.industry;
				user.interests					= linkedinUserMetadata.interests;
				user.numConnections			= linkedinUserMetadata.numConnections;
				user.numRecommenders			= linkedinUserMetadata.numRecommenders;
				user.picture					= linkedinUserMetadata.pictureUrl;
				user.link						= linkedinUserMetadata.publicProfileUrl;
				user.specialties				= linkedinUserMetadata.specialties;
				user.summary					= linkedinUserMetadata.summary;
				user.username							= utils.capitaliseFirstLetter(linkedinUserMetadata.firstName)+"-"+utils.capitaliseFirstLetter(linkedinUserMetadata.lastName);

				user.save(function (err, savedUser) {
					if (err) {
						console.log("Couldnt save new user: " + err);
                        done(err);
						return;
					} else {
						console.log("User '" + linkedinUserMetadata.id + "' created: ");
                        done(null, savedUser);
					}
				});
			}	
	});	
};

exports = module.exports = mongoose.model('User', UserSchema);