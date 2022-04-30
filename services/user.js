"use strict";
var path = require('path')
var moment = require('moment')
var bcrypt = require('bcrypt')
var utils = require("../helper/utils");
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
            if (!req.body.permission_id && req.body.permission_id !== 0) {
                return { "status": "error", "message": "There is no permission id specified!" };
            }
            if (!utils.isNotUndefined(req.body.first_name)) {
                return { "status": "error", "message": "First name is required!" };
            }
            if (!utils.isNotUndefined(req.body.mobile)) {
                return { "status": "error", "message": "Mobile is required!" };
            }
            if (!utils.isNotUndefined(req.body.username)) {
                return { "status": "error", "message": "Username is required!" };
            }
            if (!utils.isNotUndefined(req.body.password)) {
                return { "status": "error", "message": "password is required!" };
            }
            if (!utils.isValidMobile(req.body.mobile)) {
                return { "status": "error", "message": "Mobile number is not valid!" };
            }
            var usernameExist = api.findAllAsync(sequelize, "User", { 'where': { 'username': req.body.username } });
            var mobileExist = api.findAllAsync(sequelize, "User", { 'where': { 'mobile': req.body.mobile } });
            let [usernameExistResult, mobileExistResult] = await Promise.all([usernameExist, mobileExist]);
            if (usernameExistResult && usernameExistResult.length > 0) {
                return { "status": "error", "message": "Username is already registered!" };
            }
            if (mobileExistResult && mobileExistResult.length > 0) {
                return { "status": "error", "message": "Mobile is already used!" };
            }
            var encryptedPassword = await bcrypt.hash(req.body.password, 10);
            var user_data = {
                'first_name': req.body.first_name ? req.body.first_name : null,
                'middle_name': req.body.middle_name ? req.body.middle_name : null,
                'last_name': req.body.last_name ? req.body.last_name : null,
                'email': req.body.email.toLowerCase(),
                'mobile': req.body.mobile ? req.body.mobile : null,
                'username': req.body.username ? req.body.username : null,
                'password': encryptedPassword,
                'type': req.body.type ? req.body.type : null,
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            transaction = await sequelize.sequelize.transaction();
            //create user
            var userResult = await api.createT(sequelize, "User", user_data, transaction);
            var permissionObj = {
                "user_id": userResult.id,
                "permission_id": req.body.permission_id,
                "created_on": req.body.created_on ? req.body.created_on : moment(new Date()).format("X")
            }
            // inserting user permission
            var permissionResult = await api.createT(sequelize, "UserPermissions", permissionObj, transaction);
            delete userResult['password'];
            var result = {
                'Users': userResult,
                'User Permissions': permissionResult
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

