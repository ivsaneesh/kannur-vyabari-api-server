
var MySql =  function(app){
	var connection_data = app["env_configs"]["mysql"];
	var _self = this;
	var mysql = require('mysql');
	this.host 		= connection_data["host"];
	this.username 	= connection_data["username"];
	this.password 	= connection_data["password"];
	this.connection;
	this.db 		= connection_data["db"];
	// private constructor 
   	var __construct = function() {		
        _self.connection = mysql.createPool({
          connectionLimit : 10,
		  host     : _self.host,
		  user     : _self.username,
		  password : _self.password,
		  database : _self.db
		});
		//_self.connection.connection = _self.connection;
		console.log("Mysql Connection success")
		return _self.connection;
   	}()
  	this.escape = function(data){
  			return _self.connection.escape(data);
  		}
 
  this.query = function(query,callback){
  	try{
  		console.log("Executing:=>"+query);
		_self.connection.getConnection(function(err, connection) {
			  //console.log('connected as id ' + connection.threadId);
  			connection.query(query, function(err, rows, fields) {
	            connection.release();
		  		
				 if (err) {
				 	console.log(err);
				 	return callback("error mysql-sql" ,"","");
				 }
				 if(typeof callback =="function"){
				  	callback(err,rows,fields);
				 }
			});
		});

	  
	}catch(e){
		return callback("error mysql-sql","","");
	}
  }
};
module.exports = MySql;

