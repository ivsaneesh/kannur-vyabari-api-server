"use strict";
var path = require('path')
const accountSid = 'ACbe16eaabd603516cddfc7b816134a2aa';
const authToken = '6b06098a0e4bf7a501bbc2bdce0f042c';
const client = require('twilio')(accountSid, authToken);
const axios = require('axios')

class SMS {

    constructor() { }

    sendSMS(to, msg) {
        try {
            client.messages
                .create({
                    body: msg,
                    from: '+18049132984',
                    to: '+91' + to
                })
                .then(message => { return true; }).catch(err => { return false });
        }
        catch (err) {
            console.log("Error sendSMS >>>> " + err);
            return false;
        }
    }

    async areaSms(to, regId,) {
        try {
            var msg = `വ്യാപാരി മിത്രയിൽ ചേർന്നതിൽ നന്ദി. താങ്കളുടെ അംഗത്ത്വ ന: ${regId}. അംഗത്ത്വ ഫീസ് 1000 രൂപ കിട്ടി ബോധിച്ചു (MITHRA) -FIMSMS`;
            var header = 'FIMSMS';
            var host = 'sms.firstdial.info';
            var entityId = '1701158011689491554';
            var templateId = '1707165813535817820';
            var username = 'samithi';
            var password = 'samithi2022';
            var route = 'T';

            var api_url = `http://${host}/sendunicodesms?uname=${username}&pwd=${password}&senderid=${header}&to=${to}&msg=${msg}&route=${route}&peid=${entityId}&tempid=${templateId}`;
            var res = encodeURI(api_url);
            var result = await axios.post(res);//.then(data => console.log('SMS data >>> ', data));

            return result;
        }
        catch (err) {
            console.log("Error areasms >>>> " + err);
            return false;
        }
    }
}


module.exports = new SMS()