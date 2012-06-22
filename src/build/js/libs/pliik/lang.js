//my/shirt.js now does setup work
//before returning its module definition.
define([
    'Underscore',
    'config',
    'Logger'
    ],
    function(_,Config,logger) {
    
        return {
        
        
            lastactive : '', // Last active lang code ex: 'pt-PT'
            
            initialize : function(){
                             
                logger.log("---Activate Request Language---",3);  
                
                this.activateRequestLanguage();
                
            },
            
            activateRequestLanguage : function() { 
            
                // Check if there is a language specific URL pattern
                // Example: #/mercado/pt-PT
                 
                var url = window.location + '';
                
                var urlAux = url.split('/');
            
                var pathLang = urlAux[urlAux.length-1];

                
                // Check if we have activate language request already
                if ( 
                    this.lastactive == pathLang 
                    && this.lastactive != '') {
                    
                    logger.log("Bypass: " + pathLang ,3);
                    return; // Nothing to do, language change already processed!
                    
                }
                    
                this.lastactive = pathLang;                
                
                this.globalLanguageChangeRequest(pathLang);
        
            },
            
            globalLanguageChangeRequest : function(pathLang){
                
                // Iterate active languages for a language code match
                // If true we force a global language update

                if ( _.include(Config.i18n.active,pathLang) ) {
 
                    //... Set selected language at Config Object
                    Config.i18n.selected = pathLang;

                } else {
                    
                    // Language match was not found in URL
                    // Activate default language from config object.
                    
                    //... Se selected language at RequireJS
                    pathLang = Config.i18n.selected;  
                
                }

                //... Se selected language at RequireJS
                require.config({

                    locale: pathLang

                }); 
                    
                logger.log("Activate: " + pathLang,3);
                
            }
    
        }
    
    });