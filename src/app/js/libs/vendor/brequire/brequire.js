define(
    function(){

// Bbrequire - CommonJS support for the browser
function brequire(p) {
  var path = brequire.resolve(p)
  var module = brequire.modules[path];
  if(!module) throw("couldn't find module for: " + path);
  if(!module.exports) {
    module.exports = {};
    module.call(module.exports, module, module.exports, brequire.bind(path));
  }
  return module.exports;
}

brequire.modules = {};

brequire.resolve = function(path) {
  if(brequire.modules[path]) return path
  
  if(!path.match(/\.js$/)) {
    if(brequire.modules[path+".js"]) return path + ".js"
    if(brequire.modules[path+"/index.js"]) return path + "/index.js"
    if(brequire.modules[path+"/index"]) return path + "/index"    
  }
}

brequire.bind = function(path) {
  return function(p) {
    if(!p.match(/^\./)) return brequire(p)
  
    var fullPath = path.split('/');
    fullPath.pop();
    var parts = p.split('/');
    for (var i=0; i < parts.length; i++) {
      var part = parts[i];
      if (part == '..') fullPath.pop();
      else if (part != '.') fullPath.push(part);
    }
     return brequire(fullPath.join('/'));
  };
};

brequire.module = function(path, fn) {
  brequire.modules[path] = fn;
};

    return brequire;
  
});