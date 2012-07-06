//my/shirt.js now does setup work
//before returning its module definition.
define(    
    [
    'Underscore',
    'config'
    ],
    function(_,Config) {

        var active = 1;
    
        return {
            
            lastStep: 0,
            
            log : function(msgObj,step){
                
                
                if ( active  )
                    
                
                    if ( step ) {
                        
                          if (this.lastStep!=step) {
                              
                            console.log('---Step:'+step+'---'); 
                            console.log(step);
                          }
                      
                          console.log(msgObj);
     
                    }
                
                this.lastStep = step;
                
            }
            
        
        }
    
    });