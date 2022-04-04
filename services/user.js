"use strict";
var path = require('path')
//var utils = require("../../helper/utils")
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
class Users {

    constructor() {

    }
    async create(req, res) {
        var result = await this.createUser(req, res)
        return res.json(result);
    }
    async createUser(req, res) {
        var transaction;
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            transaction = await sequelize.sequelize.transaction();

            if (!req.body.permission_id) {
                return { "status": "error", "message": "There is no permission id specified!" };
            }
            var user_data = {
                'first_name': req.body.first_name ? req.body.first_name : null,
                'middle_name': req.body.middle_name ? req.body.middle_name : null,
                'last_name': req.body.last_name ? req.body.last_name : null,
                'email': req.body.email ? req.body.email : null,
                'mobile': req.body.mobile ? req.body.mobile : null,
                'username': req.body.user_name ? req.body.user_name : null,
                'password': req.body.password ? req.body.password : null,
                'type': req.body.type ? req.body.type : null,
                'created_on': req.body.created_date ? req.body.created_date : new Date()
            }
            // finding speaker role id 
            var promiseUserRole = api.findAllAsyncT(sequelize, "UserRoles", { 'where': { 'role_name': req.body.role_name } }, transaction);
            //create user
            var promiseUser = api.createT(sequelize, "Users", user_data, transaction);
            let [roleData, userResult] = await Promise.all([promiseUserRole, promiseUser]);
            var roleObj = { "user_id": userResult.id, "role_id": roleData[0].role_id }
            // inserting user role
            var roleResult = await api.createT(sequelize, "UserRolesMapping", roleObj, transaction);

            var result = {
                'Users': userResult,
                'UserRoles': roleResult,
            }
            await transaction.commit();
            return { "status": 'success', "data": result };
        }
        catch (err) {
            transaction.rollback();
            logger.error("User Create Exception :---->")
            logger.error(err)
            return { "status": 'error', "message": sequelize.getErrors(err) }
        }
    }
}


module.exports = new Users()

