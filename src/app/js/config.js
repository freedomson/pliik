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
            
            entity : 'Pliik',
            
            i18n : {
            
                selected : navigator.language || navigator.userLanguage,
                
                active: ['pt-PT','en-US']
            
            },
        
            modules : {
            
                active: ['market']
            
            },
        
            date: {
            
                format: {
                
                    year : 'yyyy'   
                
                }
            }
        }
        
        return Config
    
    });