// Filename: router.js
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'routers/interface'
    ], function($, _, Backbone, Interface ){
    
        
    
        var UsersRouter = Interface.extend({
      
            /*******************************************************************
            * ROUTES
            ********************************************************************/
    
            routes: {

                
                '/users' : 'showUsers',
                '/users/login' : 'loginUsers',  
                
                
            },

    
            // +---------------------------------
            // | Route
            // + -------------------------------- 
            
            showUsers: function(){
        
                this.renderView('views/users/list');
      
            },


            // +---------------------------------
            // | Route
            // + -------------------------------- 
            
            loginUsers: function(){
 
                this.renderView('views/users/login');
      
            }          
    
    
        });
        
        
        var initialize = function(){
            
            var UsersRouterInstance = new UsersRouter;
            
            return UsersRouterInstance;
            
        };

        return { 
            initialize: initialize
        };

  
    });