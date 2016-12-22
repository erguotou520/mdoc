import yaml from 'js-yaml'
import fs from 'fs'
// import path from 'path'
import 'colors'

export function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function deepAssign (obj, ...sources) {
  for (const source of sources) {
    if (source && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!obj.hasOwnProperty(key)) {
            obj[key] = {}
          }
          deepAssign(obj[key], source[key])
        } else {
          obj[key] = source[key]
        }
      }
    }
  }
}

export function readYaml (path) {
  let str
  try {
    str = fs.readFileSync(path, 'utf8')
  } catch (e) {
    console.log(e.toString().cyan)
  }
  return yaml.safeLoad(str || '')
}
