// Filename: router.js
define([
    'routers/interface',
    'module'
    ], function(Interface,module){


        var UsersRouter = Interface.extend({
      
            name : 'UsersRouter',
            
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