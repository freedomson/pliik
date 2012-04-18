// Filename: router.js
define([
    'jQuery',
    'Underscore',
    'Backbone'
    ], function($, _, Backbone ){
    
        
    
        var UserRouter = Backbone.Router.extend({
      
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
        
                this.AppRouter.pageTemplateRoute('views/users/list');
      
            },


            // +---------------------------------
            // | Route
            // + -------------------------------- 
            
            loginUsers: function(){
        
                console.log(this);
                this.AppRouter.pageTemplateRoute('views/users/login');
      
            }          
    
    
        });


        return UserRouter;
  
    });