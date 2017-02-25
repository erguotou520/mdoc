var path = require('path')
var util = require('./util')
var models = {}, templates = {}, resources = [], common = {file: '', obj: null}

function parse (obj) {
  switch (Object.prototype.toString.call(obj)) {
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
        obj.value = util.clone(models[model])
        delete obj.model
      } else if (obj.hasOwnProperty('template')) {
        var template = obj.template
        if (!templates[template]) {
          throw new Error('No such template: ' + template)
        }
        obj.value = util.clone(templates[template])
        delete obj.template
      }
      for (var i in obj) {
        parse(obj[i])
      }
      break
  }
}

module.exports.setup = function (folder, cb) {
  // models
  var _models = util.readFolderModule(folder, 'models')
  _models.forEach(function (model) {
    models[model.file] = model.obj
  })

  // templates
  var _templates = util.readFolderModule(folder, 'templates')
  _templates.forEach(function (template) {
    for (var name in template.obj) {
      templates[name] = template.obj[name]
    }
  })

  // resources
  var _resources = util.readFolderModule(folder, 'resources')
  Array.prototype.push.apply(resources, _resources.map(function (resource) {
    return resource.obj
  }))

  parse(models)
  parse(templates)
  parse(resources)

  // common
  Object.assign(common, util.readFileModule(path.join(folder, '/common.yaml')))
  common.obj = Object.assign({}, {
    port: 9999,
    host: 'localhost',
    theme: 'default',
    api_prefix: '/',
    doc_prefix: '/doc'
  }, common.obj)
  common.obj.themePath = path.join(__dirname, '../views/theme/', common.obj.theme)
  console.log(JSON.stringify(common, null, 2))
  console.log(JSON.stringify(resources, null, 2))
  // callback
  if (cb) {
    cb()
  }
}
module.exports.models = models
module.exports.templates = templates
module.exports.resources = resources
module.exports.common = common
