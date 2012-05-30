//my/shirt.js now does setup work
//before returning its module definition.
define(    
    [
    'Underscore',
    'config'
    ],
    function(_,Config) {

        var active = true;
    
        return {
            
            log : function(msg){
                
                if ( active )
                    
                    console.log(msg);
                
            }
            
        
        }
    
    });