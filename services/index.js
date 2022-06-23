"use strict";
var path = require('path')
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var sess = require('../helper/session')
var bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
class Index {

    constructor() {

    }

    home(req, res) {
        var logger = req.app.get('logger')
        logger.log("log test")
        logger.info("log info")
        logger.error("log error")
        logger.warn("log warn")
        res.json(req.session)
    };
    async login(req, res) {
        var user_name = req.body.username
        var pwd = req.body.password
        try {
            if (!(user_name && pwd)) {
                return res.json({ "status": "error", "message": "All input is required" });
            }
            //check given user exist or not
            //prepare cutom SQL
            var sequelize = req.app.get('sequelize')
            const Op = sequelize.Sequelize.Op;
            var logger = req.app.get('logger')
            var include = [{ model: sequelize.models.UserPermissions, as: "UserPermission" }]
            var json_obj = { where: { 'username': user_name }, include: include }
            var userData = await api.findOneAsync(sequelize, "User", json_obj);
            if (!userData) {
                return res.json({ "status": "error", "message": "User not found" })
            }
            var isPassword = await bcrypt.compare(pwd, userData.password);
            if (!isPassword) {
                return res.json({ "status": "error", "message": "Invalid credential" })
            }
            if (userData && !userData.UserPermission) {
                logger.error("User perission record not found for user")
                return res.json({ "status": "error", "message": "Something broken!" })
            }
            console.log("---",req.app["env_configs"]["jwtsecret"])
            // Create token
            const token = jwt.sign(
                { user_id: userData.id, username: userData.username, permission: userData.UserPermission.permission_id },
                req.app["env_configs"]["jwtsecret"],
                {
                    expiresIn: "8h",
                }
            );
            var result = {
                'User': userData,
                'Token': token
            }
            return res.json({ "status": 'success', "data": result });
        }
        catch (err) {
            logger.error("Member List Exception :---->")
            logger.error(err)
            return res.json({ "status": 'error', "message": sequelize.getErrors(err) })
        }
    }

    logout(req, res) {
        // sess.setLogout(req);
        return res.json({ "status": "success" })
    }


}

module.exports = new Index();

