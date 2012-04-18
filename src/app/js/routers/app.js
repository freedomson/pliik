// Filename: router.js
define([
    'jQuery',
    'Underscore',
    'Backbone',
    'routers/interface',
    'routers/users'
    ], function($, _, Backbone, InterfaceRouter, UsersRouter ){
    
    
        var AppRouter = InterfaceRouter.extend({
      
            /*******************************************************************
            * ROUTES
            ********************************************************************/
    
            routes: {
                // Define some URL routes
                '/projects': 'showProjects',               

                '*actions': 'defaultAction'
            },
    
            /*******************************************************************
            * ROUTE
            ********************************************************************/

            showProjects: function(){

                this.renderView('views/projects/list');
      
            },
            
            /*******************************************************************
            * DEFAULT ROUTE
            ********************************************************************/

            defaultAction: function(actions){

                this.renderView('views/home/main');
        
            }
    
        });

        /*******************************************************************
        * DEFAULT TEMPLATE
        ********************************************************************/

        var initialize = function(){
              
            //... Load Application Router
            var AppRouterInstance = new AppRouter;
            
            //... Load users Router
            var UsersRouterInstance = UsersRouter.initialize();
            
            Backbone.history.start();
            
        };

        return { 
            initialize: initialize
        };
  
    });
