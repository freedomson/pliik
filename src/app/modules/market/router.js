// Filename: router.js
define([
    'routers/interface',
    ], function(Interface, config ){
    

        var Router = Interface.extend({
      
            /*******************************************************************
            * ROUTES
            ********************************************************************/
    
            routes: {

                
                '/market' : 'show'
                
            },

    
            // +---------------------------------
            // | Route
            // + -------------------------------- 
            
            show: function(){
        
                console.log("Loading Module Market");
                //this.renderView('views/users/list');
      
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