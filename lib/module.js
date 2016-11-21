var path = require('path')
var util = require('./util')
var models = {}, templates = {}, common = {file: '', obj: null}

module.exports.setup = function (folder) {
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

  // common
  Object.assign(common, util.readFileModule(path.join(folder, '/common.yaml')))
}
module.exports.models = models
module.exports.templates = templates
module.exports.common = common
