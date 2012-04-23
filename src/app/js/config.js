//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
    //Do setup work here

    return {
        
        url: 'http://www.pliik.com',
        
        entity : 'testing',
        
        modules : {
            
            active: ['market']
            
        },
        
        document : {
            
            title : {
                
                separator : " at "  
                
            }
            
        },
        
        date: {
            
            format: {
                
                year : 'yyyy'   
                
            }
        }
    }
    
});