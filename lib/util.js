var fs = require('fs')
var path = require('path')
var glob = require('glob')
var yaml = require('js-yaml')
var Mock = require('mockjs')

// simple pure json clone
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function readFileModule (path) {
  var files = glob.sync(path)
  return {
    file: files[0].replace(/\.(yaml|yml)$/, ''),
    obj: yaml.safeLoad(fs.readFileSync(path, 'utf8'))
  }
}

// read modules(models, resources, templates)
function readFolderModule (rootPath, module) {
  var modulePath = path.join(rootPath, module)
  var files = glob.sync('**/*.{yaml,yml}', {
    cwd: modulePath
  })
  return files.map(function (file) {
    return {
      file: file.replace(/\.(yaml|yml)$/, ''),
      obj: yaml.safeLoad(fs.readFileSync(path.join(modulePath, file), 'utf8'))
    }
  })
}

// replace template's slot to obj
function replateTemplate (template, obj) {
  switch (Object.prototype.toString.call(template)) {
    case '[object Array]':
      template.forEach(function (item) {
        replateTemplate(item, obj)
      })
      break
    case '[object Object]':
      for (var name in template) {
        if ('slots' === name) {
          var slots = template.slots
          template['value|' + (slots || 1)] = [obj]
          delete template.slots
          break
        } else if ('slot' === name) {
          var slot = template.slot
          template['value'] = obj
          delete template.slot
          break
        } else if (['[object String]', '[object Array]'].indexOf(Object.prototype.toString.call(template[name]))) {
          replateTemplate(template[name], obj)
        }
      }
      break
  }
}

module.exports.clone = clone
module.exports.readFileModule = readFileModule
module.exports.readFolderModule = readFolderModule
module.exports.replateTemplate = replateTemplate
