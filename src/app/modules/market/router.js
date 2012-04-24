// Filename: router.js
define([
    'routers/interface',
    "i18n!modules/market/nls/market",    
    ], function(Interface, lang ){
    

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

                console.log("Loading Module Market:"+lang.market);
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