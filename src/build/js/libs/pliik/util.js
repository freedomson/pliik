//my/shirt.js now does setup work
//before returning its module definition.
define([
    'i18n!nls/i18n',
    'config'
    ],
    function(i18n,Config) {

   
        String.prototype.lpad = function(padString, length) {
            var str = this;
            while (str.length < length)
                str = padString + str;
            return str;
        }    
    
    
        return {
        
            //... Set Up Locale Language base ob requested URL
            
            parseURL : function(route){

                route = i18n.routes[route] || route;

                return '#' + route + '/' + Config.i18n.selected;
                
            }
            
    
        }
    
    });