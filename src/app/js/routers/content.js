// Filename: router.js
define([
    'routers/interface'
    ], function(Interface ){
    
        
    
        var Router = Interface.extend({
      
            /*******************************************************************
            * ROUTES
            ********************************************************************/
    
            routes: {

                
                '/content/:page' : 'show'
                
            },

    
            // +---------------------------------
            // | Route
            // + -------------------------------- 
            
            show: function(page){
                
        
                this.renderView('views/content/'+page);
      
            }      
    
    
        });
        
        
        var initialize = function(){
            
            var RouterInstance = new Router;
            
            return RouterInstance;
            
        };

        return { 
            initialize: initialize
        };

  
    });