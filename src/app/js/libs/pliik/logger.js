//my/shirt.js now does setup work
//before returning its module definition.
define(    
    [
    'Underscore',
    'config',
    'libs/pliik/util'
    ],
    function(_,Config,util) {
        
        
        return {
            
            active : Config.log.active,
            
            lastStep: 0,
            
            logcounter: 0,
            
            log : function(msgObj,step){
                

                if ( this.active )
                    
                
                    if ( step ) {
                        
                          if (this.lastStep!=step) {
                              
                            console.log('+----------------------------------------');   
                            console.log('|--->>> Step:' + step ); 
                            console.log('+----------------------------------------');   
                            
                            
                            console.log(step);
                            
                            this.logcounter = 0;
                            
                          }
                      
                          
                      

                          if(util.isset(window.PLIIK.log[this.lastStep])===false){
                              
                              window.PLIIK.log[this.lastStep]={};
                              
                          }
                      
                          window.PLIIK.log[this.lastStep][++this.logcounter] = msgObj;
                          
                          console.log(msgObj);
                          
                          this.lastStep = step;
     
                    }
                
                
            }
            
        
        }
    
    });