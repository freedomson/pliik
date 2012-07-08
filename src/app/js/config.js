/**
 * 
 * IMPORTANT: This may not include localized strings
 * 
 * 
 */
define(
    [
    'Underscore'
    ],
    function (_) {

        var Config = {
            
            site : {
                
                 root : (window.location+'').split('#')[0]
                
            },
            
            entity : 'Pliik', // Corporate Brand Name
            
            i18n : {
            
                // TODO: Refactor by Einstein
                selected :                  /* DEFAULT LANG */
                            selectDefaultLangCode('en-US'),
            
                            /**
                             AVAILABLE:
                              pt-PT
                             **/
            
                active: ['en-US','pt-PT'] // Active i18n
            
            },
        
            modules : {
            
                active: ['market']
            
            },
        
            date: {
            
                format: {
                
                    year : 'yyyy'   
                
                }
            },
            
            jquerymobile : {
                
                datatheme : 'd',
                datathemeactive: 'e',
                datathemeactivetopmenu: 'd',
                datamini: 1,
                cssname : {
                    
                    button: 'pliik-menu-item-mobile'
                    
                }
                
            }
        }
        
        
        /**
         * 
         * select default language
         * config is resposible for this?
         * it happens...
         * 
         * pt goes as pt-PT
         * != 5 goes to default lang
         * 
         */
        
        function selectDefaultLangCode(defaultlang) {

            var sel = navigator.language || navigator.userLanguage;

            if ( sel.length == 2 ) {

                sel += '-'+sel.toUpperCase();

            } else if ( sel.length != 5 ) {

               sel = defaultlang;

            }

            return sel;

        }
                
        return Config
    
    });