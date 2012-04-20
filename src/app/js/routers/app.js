// Filename: router.js
define([
    'Backbone',
    'routers/interface',
    'routers/users'
    ], function(Backbone, InterfaceRouter, UsersRouter ){
    
    
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
             
                      
            require([
                
                'views/page/template',
         
                ], function(templateView,logoView){
                    
                    //... Render Page Template
                    templateView.render();                    
                    
                    //... Load Application Router
                    var AppRouterInstance = new AppRouter;

                    //... Load users Router
                    var UsersRouterInstance = UsersRouter.initialize();    

                    Backbone.history.start();
                   
                });  
             

            
        };

        return { 
            initialize: initialize
        };
  
    });
