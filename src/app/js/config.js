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
        
            url: 'http://www.pliik.com',
        
            entity : 'COOL',
        
            i18n : {
            
                selected : navigator.language || navigator.userLanguage,
                
                active: ['pt-pt','en-en']
            
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