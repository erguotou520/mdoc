var fs = require('fs')
var path = require('path')
var glob = require('glob')
var yaml = require('js-yaml')

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

module.exports.readFileModule = readFileModule
module.exports.readFolderModule = readFolderModule
