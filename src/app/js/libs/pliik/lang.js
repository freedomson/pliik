//my/shirt.js now does setup work
//before returning its module definition.
define(    
    [
    'Underscore',
    // 'Logger'
    ],
    function(_/*,logger*/) {
    
        var lang =  {
        
            config : false, // Injected Config Object
        
            active : '', // Active lang code ex: 'pt-PT'

            parseCode : function(code) {

                // Parse 2 letters code (eg:pt on opera)
                if ( code.length == 2 ) {

                    code += '-'+code.toUpperCase();

                }
                
                // Parse Fallback
                if( code.length == 0 ) {
                    
                    code = this.config.i18n.fallback;
                    
                }

                return code;

            },
            
            getCodeFromUrl : function(){
                
                var url = window.location + '';
                
                var urlAux = url.split('/');
            
                var urlrequestcode = urlAux[urlAux.length-1];
                
                return urlrequestcode;
            },
            
            setActiveCode : function (config) { 
            
                // Check if there is a language specific URL pattern
                // Example: #/mercado/pt-PT
                
                this.config = config; 
                
                // SET DEFAULT LANG
                var activecode = this.parseCode(this.config.i18n.selected);
                 
                 // SEARCH URL FOR FORCED CODE
                var urlcode = this.getCodeFromUrl() || activecode;

                
                // Special Log TODO: Observer
                 window.PLIIK.log.lang_detected=activecode;
                 window.PLIIK.log.lang_request=urlcode;
                
                // Check if we have activate language request already
                if ( activecode == urlcode ) {

                    // logger.log("Bypass: " + pathLang ,3);
                    return activecode; // Nothing to do, language change already processed!
                    
                }


                // activeCode = this.queryInActiveCountryCodes(urllangcode);


                this.active = urlcode;
     
                return urlcode;
                
            },
            
            getActiveCode : function(config){
              
                return this.setActiveCode(config);
              
            },
            
            /* TODO: this is not in use */
            requestInActiveCountryCodes : function(pathLang){

                // Iterate active languages for a language code match
                // If true we force a global language update

                if ( _.include(this.config.i18n.active,pathLang) ) {
 
                    //... Set selected language at Config Object
                    return true;

                } else {
                    
                    return false;
                    
                }
                
            }
    
        }
        
        
        return lang;
    
    });