'use strict';

const Hoek = require('hoek');
var MongooseConnector = require('./MongooseConnector');

const internals = {};

internals.defaults = {
  uri: 'mongodb://127.0.0.1:27017',
  promises: 'mpromises', // use built-in mpromises by default
  mongooseOptions: {}
};

const register = async (server, options) => {
  return new Promise((resolve, reject) => {
    const settings = Hoek.applyToDefaults(internals.defaults, options);
    let connector = new MongooseConnector(settings, server);

    connector.on('ready', () => {
      server.expose('lib', connector.mongoose);
      server.expose('connection', connector.connection);

      resolve();
    });

    connector.on('error', err => reject(err));
  }
};

const plugin = {
    register,
    attributes: {
      pkg: require('../package.json')
    }
    name: 'pluginName',
    version: '1.0.1'
};


module.exports = plugin;
