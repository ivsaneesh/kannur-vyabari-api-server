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
	this.models.Permission = require('../model/permission.js')(this.sequelize, this.Sequelize);
	this.models.UserPermissions = require('../model/user_permissions.js')(this.sequelize, this.Sequelize);
	this.models.User = require('../model/user.js')(this.sequelize, this.Sequelize);
	this.models.Member = require('../model/member.js')(this.sequelize, this.Sequelize);
	this.models.Family = require('../model/family.js')(this.sequelize, this.Sequelize);
	this.models.Business = require('../model/business.js')(this.sequelize, this.Sequelize);
	this.models.Nominee = require('../model/nominee.js')(this.sequelize, this.Sequelize);
	this.models.Collection = require('../model/collection.js')(this.sequelize, this.Sequelize);
	this.models.CollectionAmount = require('../model/collection_amount.js')(this.sequelize, this.Sequelize);
	this.models.Death = require('../model/death.js')(this.sequelize, this.Sequelize);
	this.models.Collector = require('../model/collector.js')(this.sequelize, this.Sequelize);
	this.models.Unit = require('../model/unit.js')(this.sequelize, this.Sequelize);
	this.models.Area = require('../model/area.js')(this.sequelize, this.Sequelize);


	//relations for user
	this.models.User.hasOne(this.models.UserPermissions, { foreignKey: "user_id", as: 'UserPermission' });
	this.models.UserPermissions.belongsTo(this.models.Permission, { foreignKey: "permission_id", as: "Permission" });
	this.models.Member.hasMany(this.models.Business, { foreignKey: "member_id", as: "Business" });
	this.models.Member.hasMany(this.models.Family, { foreignKey: "member_id", as: "Family" });
	this.models.Member.hasMany(this.models.Nominee, { foreignKey: "member_id", as: "Nominee" });
	this.models.Member.belongsTo(this.models.Unit, { foreignKey: "unit_id", as: "Unit" });
	this.models.Member.belongsTo(this.models.Area, { foreignKey: "area_id", as: "Area" });
	this.models.Collection.belongsTo(this.models.Member, { foreignKey: "member_id", as: "Member" });
	this.models.Collection.belongsTo(this.models.CollectionAmount, { foreignKey: "amount_id", as: "CollectionAmount" });


	this.models.Collector.belongsTo(this.models.Unit, { foreignKey: "unit_id", as: "Unit" });
	this.models.Collector.belongsTo(this.models.Area, { foreignKey: "area_id", as: "Area" });

	this.models.Unit.belongsTo(this.models.Area, { foreignKey: "area_id", as: "Area" });
};
module.exports = db;

