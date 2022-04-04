var path = require('path');

module.exports = function(app) {
   
    //handling 404
    app.use(function (req, res, next) {
         return res.status(404).send("Sorry can't find that!")
    })

    // error handlers
    app.use(function (err, req, res, next) {
        console.error(err.stack)
        return res.status(500).send(err + ' Something broken!')
    })

};