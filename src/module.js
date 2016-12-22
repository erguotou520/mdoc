import glob from 'glob'
// import path from 'path'
import 'colors'
import { deepAssign, readYaml } from './util'

// config default value
export const config = {
  theme: 'default',
  docUrlPrefix: '__doc'
}

// common default value
export const common = {
  restful: {
    id: 'id',
    query: {
      resStatus: 200
    },
    get: {
      resStatus: 200
    },
    save: {
      resStatus: 200,
      res: {
        // default return saved id
        id: '@uuid'
      }
    },
    update: {
      resStatus: 200,
      res: {
        // default return updated id
        id: '@uuid'
      }
    },
    delete: {
      resStatus: 201
    }
  }
}

// models
export const models = []

// templates
export const templates = []

// resources
export const resources = []

export function setup (path) {
  const globPath = path.replace('\\', '/')
  // config
  const configFile = glob.sync(`${globPath}/config.@(yml|yaml)`)
  if (configFile.length) {
    deepAssign(config, readYaml(configFile[0]))
  }

  // common
  const commonFile = glob.sync(`${globPath}/common.@(yml|yaml)`)
  if (commonFile.length) {
    deepAssign(common, readYaml(commonFile[0]))
  }

  // models
  const modelFiles = glob.sync(`${globPath}/models/**/*.@(yml|yaml)`)
  modelFiles.forEach(file => {
    let model = readYaml(file)
    if (model) {
      models.push(model)
    }
  })

  // templates
  const templateFiles = glob.sync(`${globPath}/templates/**/*.@(yml|yaml)`)
  templateFiles.forEach(file => {
    let template = readYaml(file)
    if (template) {
      templates.push(template)
    }
  })

  // resources
  const resourceFiles = glob.sync(`${globPath}/resources/**/*.@(yml|yaml)`)
  resourceFiles.forEach(file => {
    let resource = readYaml(file)
    if (resource) {
      resources.push(resource)
    }
  })
}
