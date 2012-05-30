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