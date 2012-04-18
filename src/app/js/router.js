// Filename: router.js
define([
    'jQuery',
    'Underscore',
    'Backbone',
    ], function($, _, Backbone ){
    
    
        var AppRouter = Backbone.Router.extend({
      
            /*******************************************************************
            * ROUTES
            ********************************************************************/
    
            routes: {
                // Define some URL routes
                '/projects': 'showProjects',
                '/users': 'showUsers',
                // Default
                '*actions': 'defaultAction'
            },
    
            /*******************************************************************
            * ROUTE
            ********************************************************************/

            showProjects: function(){

                RouteHelper_PageTemplateRoute('views/projects/list');
      
            },
    
            /*******************************************************************
            * ROUTE
            ********************************************************************/

            showUsers: function(){
        
                RouteHelper_PageTemplateRoute('views/users/list');
      
            },
    
            /*******************************************************************
            * DEFAULT ROUTE
            ********************************************************************/

            defaultAction: function(actions){
        
                RouteHelper_PageTemplateRoute('views/home/main');
        
            }
    
        });

        /*******************************************************************
        * DEFAULT TEMPLATE
        ********************************************************************/

        var initialize = function(){
            var app_router = new AppRouter;
            Backbone.history.start();
        };

        /*******************************************************************
        * ROUTE HELPER - mainPageViewRoute
        ********************************************************************/
       
        var RouteHelper_PageTemplateRoute = function( contentView, pageView ){

            require([
                pageView || 'views/page/main',
                contentView
                ], function(mainPageView,view){
                    mainPageView.render();
                    view.render();
                });

        };
        
        return { 
            initialize: initialize
        };
  
    });
