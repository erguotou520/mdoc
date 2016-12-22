'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resources = exports.templates = exports.models = exports.common = exports.config = undefined;
exports.setup = setup;

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

require('colors');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// config default value

// import path from 'path'
var config = exports.config = {
  theme: 'default',
  docUrlPrefix: '__doc'
};

// common default value
var common = exports.common = {
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
};

// models
var models = exports.models = [];

// templates
var templates = exports.templates = [];

// resources
var resources = exports.resources = [];

function setup(path) {
  var globPath = path.replace('\\', '/');
  // config
  var configFile = _glob2.default.sync(globPath + '/config.@(yml|yaml)');
  if (configFile.length) {
    (0, _util.deepAssign)(config, (0, _util.readYaml)(configFile[0]));
  }

  // common
  var commonFile = _glob2.default.sync(globPath + '/common.@(yml|yaml)');
  if (commonFile.length) {
    (0, _util.deepAssign)(common, (0, _util.readYaml)(commonFile[0]));
  }

  // models
  var modelFiles = _glob2.default.sync(globPath + '/models/**/*.@(yml|yaml)');
  modelFiles.forEach(function (file) {
    var model = (0, _util.readYaml)(file);
    if (model) {
      models.push(model);
    }
  });

  // templates
  var templateFiles = _glob2.default.sync(globPath + '/templates/**/*.@(yml|yaml)');
  templateFiles.forEach(function (file) {
    var template = (0, _util.readYaml)(file);
    if (template) {
      templates.push(template);
    }
  });

  // resources
  var resourceFiles = _glob2.default.sync(globPath + '/resources/**/*.@(yml|yaml)');
  resourceFiles.forEach(function (file) {
    var resource = (0, _util.readYaml)(file);
    if (resource) {
      resources.push(resource);
    }
  });
}