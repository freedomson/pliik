// Filename: router.js
define([
    'jQuery',
    'Backbone',
    'routers/interface',
    'routers/content',   
    'routers/users',
    'libs/pliik/module-loader'    
    ], function(
        $,
        Backbone, 
        InterfaceRouter,
        ContentRouter, 
        UsersRouter,
        modules){
    
    
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

                this.renderView('views/content/home');
        
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

                    //... Load Pages Router
                    var ContentRouterInstance = ContentRouter.initialize();    

                    //... Load Users Router
                    var UsersRouterInstance = UsersRouter.initialize();    


                    //...Module Route Loader
                    $.each(
                        modules.routers,       
                        function(index, value) { 
                            require(value).initialize();
                    });                    

                    Backbone.history.start();
                   
                });  
             

            
        };

        return { 
            initialize: initialize
        };
  
    });
