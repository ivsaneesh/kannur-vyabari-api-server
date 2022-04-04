/*************************
author : @Fairusudheen
sequelize manager script
*************************/
var db = function (app) {
	this.Sequelize = require('sequelize');
	var connection_data = app["env_configs"]["mysql"];
	var _this = this;
	this.sequelize = new this.Sequelize(connection_data["db"], connection_data["username"], connection_data["password"], {
		host: connection_data["host"],
		dialect: 'mysql',
		operatorsAliases: false,

		pool: {
			max: 10,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	});


	//retrieve and formats the errors 
	this.getErrors = function (err) {

		console.log("Error => ", err)

		var errors = "Unexpected error!"
		var err_arr = new Array()
		try {
			if (err.errors) {
				for (var i in err.errors) {
					err_arr.push(err.errors[i].message)
				}
				errors = err_arr.join("\n");
			}
			else if (err.original && err.original.sqlMessage) {
				errors = err.original.sqlMessage;
			}

		} catch (e) {
				console.log("Error => ", e)
		 }
		return errors;
	}


	this.models = {};
};
module.exports = db;

