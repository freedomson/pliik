//my/shirt.js now does setup work
//before returning its module definition.
define(    
    [
    'Underscore',
    'config'
    ],
    function(_,Config) {


        String.prototype.lpad = function(padString, length) {
            var str = this;
            while (str.length < length)
                str = padString + str;
            return str;
        }    
    
    
        return {
        
            //... Set Up Locale Language base ob requested URL
            
            parseURL : function(route){
                
                return '#' + route + '/' + Config.i18n.selected;
            },
            
            setUpLanguage : function(){
            
                var url = window.location + '';
            
                var urlAux = url.split('/');
            
                var pathLang = urlAux[urlAux.length-1];

                if ( _.include(Config.i18n.active,pathLang) ) {

                    //... Set selected language at Config Object
                    Config.i18n.selected = pathLang;
                       
                    //... Se selected language at RequireJS
                    require.config({
                        
                        locale: pathLang
                        
                    });              

                }   
                            
            }
        
        }
    
    });