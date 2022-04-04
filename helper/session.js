/*************************************
Author: Fairusudheen
Helper class for session management
**************************************/


var Session = function () {
	this.setLogin = function (req, user_type, user) {
		req.session.is_logged = true;
		req.session.user = user;
		req.session.user_type = user_type;
	}

	this.setLogout = function (req) {
		req.session.is_logged = false;
		req.session.user = {};
		req.session.user_type = "";
	}
	

	
};



module.exports = new Session();