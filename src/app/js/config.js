/**
 * 
 * IMPORTANT: This may not include localized strings
 * 
 * 
 */
define(
    function () {
        //Do setup work here

        return {
            
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
    
    });