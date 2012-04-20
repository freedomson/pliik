// Filename: router.js
define([
    'routers/interface'
    ], function(Interface ){
    
        
    
        var UsersRouter = Interface.extend({
      
            /*******************************************************************
            * ROUTES
            ********************************************************************/
    
            routes: {

                
                '/users' : 'show',
                '/users/login' : 'login',  
                '/users/signup' : 'signup' 
                
            },

    
            // +---------------------------------
            // | Route
            // + -------------------------------- 
            
            show: function(){
        
                this.renderView('views/users/list');
      
            },

            // +---------------------------------
            // | SignUp
            // + -------------------------------- 
            
            signup: function(){
 
                this.renderView('views/users/signup');
      
            },
            
            // +---------------------------------
            // | Login
            // + -------------------------------- 
            
            login: function(){
 
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