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
            
                selected : navigator.language || navigator.userLanguage,
                
                active: ['pt-PT','en-US'] // Active i18n
            
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
                datamini: 1
                
            }
        }
        
        return Config
    
    });