var fs = require('fs')
var path = require('path')
var glob = require('glob')
var yaml = require('js-yaml')
var Mock = require('mockjs')

// simple pure json clone
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// check obj has the property of string/regexp
function hasProperty(obj, check) {
  if (typeof check === 'string') {
    return obj[check] !== undefined ? check : false
  }
  var reg = new RegExp(check)
  for(var key in obj) {
    if (reg.test(key)) {
      return key
    }
  }
}

function isString (str) {
  return Object.prototype.toString.call(str) === '[object String]'
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

function isObject (arr) {
  return Object.prototype.toString.call(arr) === '[object Object]'
}

function isPrimitive (obj) {
  return obj == null || ['string', 'number', 'boolean'].indexOf(typeof obj) > -1
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

function changeParent (parent, name, value, obj) {
  var _name = value.replace(/^value/, name)
  if (parent) {
    delete parent[name]
    parent[_name] = obj[value]
  }
}

function removeComment (obj, parent, name) {
  switch (Object.prototype.toString.call(obj)) {
    case '[object Array]':
      obj.forEach(function (sub, index) {
        removeComment(sub, obj, index)
      })
      break
    case '[object Object]':
      var _value = hasProperty(obj, 'value') || hasProperty(obj, /value\|\d(-\d){0,1}/)
      if (_value) {
        if (isPrimitive(obj[_value])) {
          changeParent(parent, name, _value, obj)
        } else if (isArray(obj[_value])) {
          obj[_value].forEach(function (sub, index) {
            removeComment(sub, obj[_value], index)
          })
          changeParent(parent, name, _value, obj)
        } else if (isObject(obj[_value])) {
          for (var key in obj[_value]) {
            removeComment(obj[_value][key], obj[_value], key)
          }
          changeParent(parent, name, _value, obj)
        }
      } else {
        for (var key in obj) {
          removeComment(obj[key], obj, key)
        }
      }
      break
  }
}

module.exports.clone = clone
module.exports.readFileModule = readFileModule
module.exports.readFolderModule = readFolderModule
module.exports.replateTemplate = replateTemplate
module.exports.removeComment = removeComment
