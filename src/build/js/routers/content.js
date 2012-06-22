// Filename: router.js
define([
    'routers/interface',
    'i18n!nls/i18n'
    ], function(Interface,i18n){
    
        
        
        var Router = Interface.extend({
      
             name : 'Router',       
      
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

                var translatedPage = i18n.content[page] || page;
                    
                this.renderView('views/content/'+translatedPage);
      
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