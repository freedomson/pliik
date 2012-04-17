// Brequire - CommonJS support for the browser
function require(p) {
  var path = require.resolve(p)
  var module = require.modules[path];
  if(!module) throw("couldn't find module for: " + path);
  if(!module.exports) {
    module.exports = {};
    module.call(module.exports, module, module.exports, require.bind(path));
  }
  return module.exports;
}

require.modules = {};

require.resolve = function(path) {
  if(require.modules[path]) return path
  
  if(!path.match(/\.js$/)) {
    if(require.modules[path+".js"]) return path + ".js"
    if(require.modules[path+"/index.js"]) return path + "/index.js"
    if(require.modules[path+"/index"]) return path + "/index"    
  }
}

require.bind = function(path) {
  return function(p) {
    if(!p.match(/^\./)) return require(p)
  
    var fullPath = path.split('/');
    fullPath.pop();
    var parts = p.split('/');
    for (var i=0; i < parts.length; i++) {
      var part = parts[i];
      if (part == '..') fullPath.pop();
      else if (part != '.') fullPath.push(part);
    }
     return require(fullPath.join('/'));
  };
};

require.module = function(path, fn) {
  require.modules[path] = fn;
};