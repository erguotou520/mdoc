require('babel-polyfill')
var path = require('path')
var util = require('./util')
var _module = require('./module')

module.exports = function (folder, startListen) {
  // init module
  _module.setup(folder, function () {
    var app = require('./express')

    // doc
    var docRouter = require('./doc-router')
    app.use(_module.common.obj.doc_prefix, docRouter)

    // api
    var apiRouter = require('./api-router')
    app.use(_module.common.obj.api_prefix, apiRouter)

    // api fallback
    app.route('/*').get(function (req, res) {
      res.status(404).json({ message: 'not found' })
    })
    // start to listen for api
    if (startListen !== false) {
      // start express server
      var server = app.listen(_module.common.port, _module.common.host, function () {
        var host = server.address().address
        var port = server.address().port
        console.log('Example app listening at http://%s:%s', host, port)
      })
    }
  })
}
