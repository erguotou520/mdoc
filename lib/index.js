var path = require('path')
var util = require('./util')
var app = require('./express')
var router = require('./routes')

var models = {}, templates = {}, resources = []

// simple pure json clone
function clone (obj) {
  JSON.parse(JSON.stringify(obj))
}

function parse (obj) {
  switch (Object.prototype.toString.call(obj)) {
    case '[object String]':

      break
    case '[object Array]':
      obj.forEach(function (o) {
        parse(o)
      })
      break
    case '[object Object]':
      // model: xxx
      if (obj.hasOwnProperty('model')) {
        var model = obj.model
        if (!models[model]) {
          throw new Error('No such model: ' + model)
        }
        obj.value = clone(models[model])
        delete obj.model
      } else if (obj.hasOwnProperty('template')) {

      }
      break
  }
}

module.exports = function (folder) {
  // models
  var _models = util.readFolderModule(folder, 'models')
  _models.forEach(function (model) {
    models[model.file] = model.obj
  })

  // templates
  var _templates = util.readFolderModule(folder, 'templates')
  _templates.forEach(function (template) {
    for (var name in template.obj) {
      _templates[name] = template.obj[name]
    }
  })

  // common
  var _common = util.readFileModule(path.join(folder, '/common.yaml'))

  // resources
  resources = util.readFolderModule(folder, 'resources')
  resources.forEach(function (resource) {
    var $resource = resource.obj
    if ($resource.restful) {
      router.resource($resource.prefix, $resource.model, $resource.resources ? $resource.resources.restful : null)
    }
    delete $resource.restful
    router.add($resource.prefix, $resource)
  })

  app.use(_common.obj.api_prefix || '/', router.router)

  app.route('/*').get(function (req, res) {
    res.status(404).json({ message: 'not found' })
  })

  // start express server
  var server = app.listen(_common.port || 9999, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}
