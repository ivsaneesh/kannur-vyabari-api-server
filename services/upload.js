"use strict";
var path = require('path')
var moment = require('moment')
var utils = require("../helper/utils");
var path_controller = path.normalize(__dirname + "/../controllers/")
var api = require(path_controller + '/api')
var fs = require('fs');

class Upload {

    constructor() {

    }
    uploadFile(req, res) {
        try {
            const file = req.files.file;
            const dir = req.body.dir;
            if (!file) {
                return res.json({ "status": 'error', "message": "File missing" })
            }

            const extention = path.extname(file.name);
            const allowedExtension = /png|jpeg|jpg|gif/;

            if (!allowedExtension.test(extention)) {
                return res.json({ "status": 'error', "message": "Invalid file extension" })
            }
            else {
                const { v4: uuidv4 } = require('uuid');
                var uid = uuidv4();
                var fileName = uid + extention;

                const url = "uploads/"+ (dir ? dir : 'default') + '/' ;
                

                if (!fs.existsSync("./public/" + url)){
                    fs.mkdirSync("./public/" + url, { recursive: true });
                }
                
                var file_path = url + fileName;
                file.mv("./public/" + file_path, function (err) {
                    if (err) {
                        return res.json({ "status": 'error', "message": err });
                    }
                    else {
                        return res.json({ "status": 'success', "data": {"name": file_path} });
                    }
                });
            }
        }
        catch (err) {
            console.log("Error uploadFile >>>> " + err);

            return res.json({ "status": 'error', "message": err });

        }
    }
}


module.exports = new Upload()