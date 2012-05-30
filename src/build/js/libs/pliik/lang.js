//my/shirt.js now does setup work
//before returning its module definition.
define([
    'Underscore',
    'config'
    ],
    function(_,Config) {
    
        return {
        
            initialize : function(){
                
                this.activateURLLanguage();
                
            },
            
            activateURLLanguage : function() { 
            
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