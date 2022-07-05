"use strict";
var path = require('path')
const accountSid = 'ACbe16eaabd603516cddfc7b816134a2aa';
const authToken = '6b06098a0e4bf7a501bbc2bdce0f042c';
const client = require('twilio')(accountSid, authToken);

class SMS {

    constructor() {

    }
    sendSMS(to,msg) {
        try {
            client.messages
                .create({
                    body: msg,
                    from: '+18049132984',
                    to: '+91'+ to
                })
                .then(message => {return true;}).catch(err => {return false});
        }
        catch (err) {
            console.log("Error sendSMS >>>> " + err);
            return false;
        }
    }
}


module.exports = new SMS()