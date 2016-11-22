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

function removeComment (obj, objName) {
  switch (Object.prototype.toString.call(obj)) {
    case '[object Array]':
      obj.forEach(function (o) {
        removeComment(o)
      })
      break
    case '[object Object]':
      for (var name in obj) {
        if ('value' === name) {
          removeComment(obj.value)
          obj = obj.value
          return
        } else if (/value\|\d(-\d){0,1}/.test(name)) {
          removeComment(obj[name])
          var _return = {}
          _return[obj[name].replace(/value/, objName)] = obj[name]
          return _return
        }
      }
      if (!found) {
        var _new = removeComment(obj[name], name)
        delete obj[name]
        for (var i in _new) {
          obj[i] = _new[i]
        }
      }
      break
  }
}

module.exports.clone = clone
module.exports.readFileModule = readFileModule
module.exports.readFolderModule = readFolderModule
module.exports.replateTemplate = replateTemplate
