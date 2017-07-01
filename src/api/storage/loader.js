var Promise = require("bluebird");

var storages = {
  static: require('./static')
}

module.exports = (name) => {
  let storage = storages[name]
//  Promise.promisifyAll(storage);
  return storage;
};
