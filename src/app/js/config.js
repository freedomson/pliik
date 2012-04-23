//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
    //Do setup work here

    return {
        
        url: 'http://www.pliik.com',
        
        entity : 'Pliik',
        
        modules : {
            
            active: ['demo']
            
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