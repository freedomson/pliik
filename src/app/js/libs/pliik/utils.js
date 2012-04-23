//my/shirt.js now does setup work
//before returning its module definition.
define(function() {

    String.prototype.lpad = function(padString, length) {
            var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    }                
    
});