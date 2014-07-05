exports.all = function(req, res){
    try{
    	res.render("index", {"name" : "Hello world!"});
    }catch(err){
		console.log(err);
		res.json({"isSuccess" : false, msg : (err.message || err)});
	}
};