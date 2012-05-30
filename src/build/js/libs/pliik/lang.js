//my/shirt.js now does setup work
//before returning its module definition.
define([
    'Underscore',
    'config'
    ],
    function(_,Config) {
    
        return {
        
            initialize : function(){
                             
                this.activateRequestLanguage();
                
            },
            
            activateRequestLanguage : function() { 
            
                // Check if there is a language specific URL pattern
                // Example: #/mercado/pt-PT
                 
                var url = window.location + '';
                
                var urlAux = url.split('/');
            
                var pathLang = urlAux[urlAux.length-1];
                
                // Iterate active languages for a language code match
                // If true we force a global language update

                if ( _.include(Config.i18n.active,pathLang) ) {
 
                    //... Set selected language at Config Object
                    Config.i18n.selected = pathLang;
                       
                    //... Se selected language at RequireJS
                    require.config({
          
                        locale: pathLang
                            
                    });              

                } else {
                    
                    // Language match was not found in URL
                    // Activate default language from config object.
                    
                    //... Se selected language at RequireJS
                    require.config({

                        locale: Config.i18n.selected

                    });       
                
                }
        
            }
    
        }
    
    });