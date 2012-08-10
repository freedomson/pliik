/**
 * 
 * IMPORTANT: This may not include localized strings
 * 
 * 
 */
define(
    [
    'Underscore',
    'lang'
    ],
    function (_,lang) {

        var Config = {
            
            
            log : {
                
                    active : 1
                    
            },
                
            site : {
                
                 root : (window.location+'').split('#')[0]
                
            },
            
            entity : 'Pliik', // Corporate Brand Name
            
            i18n : {
            
                // TODO: Refactor by Einstein
                
                fallback : 'pt-PT',
                    
                selected :   navigator.language || navigator.userLanguage,
            
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
            
            /**
             * Main PliiK Navigation System
             * 
             */
            paper : {
              
                // Ex: config.nav.button.classname
                el : {
                    
                    suffix: 'pliik-nav-button',
                    
                    classname : 'pliik-nav-button'
                    
                }
                
            },
            
            /**
             * jQuery integration system
             */
            jquerymobile : {
                
                transitionspeed : 'slow',
                
                datatheme : 'b',
                datathemeactive: 'a',
                datathemeactivetopmenu: 'a',
                datamini: 1,
                
                cssname : {
                    
                    button: 'pliik-menu-item-mobile'
                    
                }
                
            }
        }
                  
             
        // start: Localization
        // Currently only full page load supported :|
        // ++++++++++++++++++++++++++++++++
        
        var langcode = lang.getActiveCode( Config );
        
        Config.i18n.selected = langcode;
  
        // window.PLIIK.log.lang_request=Config;
                 
        require.config({

            locale: langcode

        });         
        
        // ++++++++++++++++++++++++++++++++ 
        // end: Localization

                  
                  
        return Config
    
    });