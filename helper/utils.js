var fs = require("fs");

exports.getConfigs = function (env){
       var configs = JSON.parse(fs.readFileSync('./config/env.json',"utf8"));
       return configs[env];
}

exports.removeKeys = function (json_obj,exclude){
    for(var i in exclude){
        delete json_obj[exclude[i]]
    }
    return json_obj
}
exports.isNotUndefined = function(terms) {
   if(typeof(terms) != "undefined" && terms != "null" && terms != null && terms !== "" && terms !== undefined){
            return true;
          }else{
              return false;
          }
}
/*
|--------------------------------------------------------------------------
| isValidJSONString
|--------------------------------------------------------------------------
| Method to check string is a valid json string or not
|
*/
exports.isValidJSONString = function(_string){
	try{
		if (/^[\],:{}\s]*$/.test(_string.replace(/\\["\\\/bfnrtu]/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
			 return true;
		}else{
			return false;
		}
	}
	catch(e){
		return false;
	}
}