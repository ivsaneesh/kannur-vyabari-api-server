/******************************
Author : @Fairusudheen
Http methods
Methods
getData : options , callBack
********************************/
var httpManager = function() {};
var logger = require('../logger/logger');
var http = (process.env.NODE_ENV == "development") ? require('http') : require('http');
var https = require('https');
var request = require('request');

httpManager.prototype.post  = function(url_path,json,cb){
    request.post({url: url_path, json: json}, function(error, response, body) {
        if (error)logger.log("error", error, "Exception in httpManager::post");
        return cb (body,error);
    })
}
httpManager.prototype.getData = function(req,options, callback, data, is_https,params) {
    var cust_logger = new logger.customLogger("request_time_log.log");
    
    try {
        logger.log("info", options, "HttpManager options");
        if(typeof req.app =="undefined") return callback && callback("");

        var req_obj = {"app":{"redisClient":req.app.redis_client,"root_dir":req.app.root_dir}};
        req.dataUrl = options.path;        
        var context = {"req":req};

        var d = new Date();
        var time = d.getTime();

        


        var _http = is_https ? https : http;

        var httpreq = _http.request(options, function(result) {
        var output = '';
        result.setEncoding('utf8');
        
        result.on('data', function(chunk) {
            output += chunk;
        });

        result.on('end', function() {
            req.dataUrl = options.path;
            var context = {"req":req};
            var return_page_url = params ? params.return_page_url : false;
            if(return_page_url){
                var page_url = result.headers ? result.headers.pager : {};
                console.log("********************result.headers*************************");
                console.log("result.headers",JSON.stringify(result.headers));
                console.log("********************result.headers*************************");
                output = {"data":output,"page_url":page_url}
            }
            console.log("output",typeof output);

            var d1 = new Date();
            var time1 = d1.getTime();
            var took = (time1-time)/1000;//in sec

            // if took more than 1 sec
            if (took > 0.25) {
                cust_logger.log("error",options.path + " took " + took + " seconds") 
            }

            callback && callback(output);
        });

    });

    httpreq.on('error', function(err) {
        logger.log("error", err, "Error in  API");
        logger.log("error", options, "Error options in  API");
        callback && callback("{}");
    });

    if ((options.method == "POST" || options.method == "PUT") && typeof data != typeof undefined) {
        httpreq.write(data);
    };

    httpreq.end();
    } catch (e) {
        logger.log("error", e.message, "Exception in httpManager::getData");
        callback && callback("{}");
    }
}

/*
|--------------------------------------------------------------------------
| makePostRequestOption
|--------------------------------------------------------------------------
| Method to generate option for get request
|
| @param <req> [required => true] [type => object] [desc => current server request]
|
| @param <path> [required => true] [type => string] [desc => request path]
|
| @param <req_param> [required => false] [type => string] [desc => url parameter if any]
|
*/
httpManager.prototype.makePostRequestOption = function(req, path, data, type,host,port){
    try{
        data = typeof data != "string" ? JSON.stringify(data) : data;
        var request_id = req.request_id ? req.request_id : "";
        return {
                hostname : host,
                port : port,
                path : encodeURI(path),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(data),
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip,deflate,sdch',
                    'Accept-Language': 'en-US,en;q=0.8'
                 }
            }
    }
    catch(e){
        logger.log('error', e.message, 'Exception in httpManager::makePostRequestOption');
    }
}



module.exports = httpManager;