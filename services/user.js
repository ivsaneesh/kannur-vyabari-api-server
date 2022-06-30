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
                'created_on': req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,
            }
            transaction = await sequelize.sequelize.transaction();
            //create user
            var userResult = await api.createT(sequelize, "User", user_data, transaction);
            var permissionObj = {
                "user_id": userResult.id,
                "permission_id": req.body.permission_id,
                "created_on": req.body.created_on ? req.body.created_on : moment(new Date()).format("X"),
                'created_by': req.user.user_id,
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
    async listUser(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        const Op = sequelize.Sequelize.Op
        var offset = req.body.start ? req.body.start : 0
        var limit = req.body.limit ? req.body.limit : 10000
        var pagination = req.body.pagination ? (req.body.pagination == 1 ? 1 : 0) : 0
        var user_condition = {}
        try {

            if (utils.isNotUndefined(req.body.id)) {
                user_condition.id = req.body.id;
            }
            if (utils.isNotUndefined(req.body.search)) {
                user_condition = { [Op.or]: [{ first_name: { [Op.like]: '%' + req.body.search + '%' } }, { middle_name: { [Op.like]: '%' + req.body.search + '%' } }, { last_name: { [Op.like]: '%' + req.body.search + '%' } }, { mobile: { [Op.like]: '%' + req.body.search + '%' } }] };
            }
            user_condition.deleted = 0;
            var json_obj = { where: user_condition }
            json_obj.offset = offset
            json_obj.limit = limit
            json_obj.pagination = pagination
            if (req.body.sort_column) {
                json_obj.order = [[req.body.sort_column, req.body.sort_order ? req.body.sort_order : "ASC"]]
            }
            var result = await api.findAllAsync(sequelize, "User", json_obj);
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("User List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async updateUser(req, res) {
        var sequelize = req.app.get('sequelize')
        const Op = sequelize.Sequelize.Op;
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.user_id)) {
                return res.json({ "status": "error", "message": "User id is required!" });
            }
            const user_data = {}
            if (utils.isNotUndefined(req.body.first_name)) user_data.first_name = req.body.first_name;
            if (utils.isNotUndefined(req.body.middle_name)) user_data.middle_name = req.body.middle_name;
            if (utils.isNotUndefined(req.body.last_name)) user_data.last_name = req.body.last_name;
            if (utils.isNotUndefined(req.body.email)) user_data.email = req.body.email;
            if (utils.isNotUndefined(req.body.mobile)) user_data.mobile = req.body.mobile;
            if (utils.isNotUndefined(req.body.type)) user_data.type = req.body.type;
            if (utils.isNotUndefined(req.body.password)) user_data.password = await bcrypt.hash(req.body.password, 10);

            if (utils.isNotUndefined(req.body.block_reason)) user_data.block_reason = req.body.block_reason;
            if (utils.isNotUndefined(req.body.blocked)) {
                user_data.blocked = req.body.blocked;
                user_data.blocked_on = moment(new Date()).format("X");
            }

            user_data.modified_on = moment(new Date()).format("X");
            user_data.modified_by = req.user.user_id;

            var condition = { where: { 'id': req.body.user_id } };

            api.updateCustom(sequelize, 'User', user_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("User Update Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    async deleteUser(req, res) {
        var sequelize = req.app.get('sequelize')
        var logger = req.app.get('logger')
        try {
            if (!utils.isNotUndefined(req.body.user_id)) {
                return res.json({ "status": "error", "message": "User id is required!" });
            }
            const user_data = {}
            user_data.deleted = 1;
            user_data.modified_on = moment(new Date()).format("X");
            user_data.modified_by = req.user.user_id;

            var condition = { where: { 'id': req.body.user_id } };

            // updating User to deleted 1
            api.updateCustom(sequelize, 'User', user_data, condition, function (status, data, message) {
                if (status == 'error') {
                    return res.json({ "status": status, "message": message })
                }
                else {
                    return res.json({ "status": status, "data": data, "message": message })
                }
            });
        }
        catch (err) {
            logger.error("User delete Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

}


module.exports = new Users()

