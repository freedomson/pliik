// Filename: router.js
define([
    'Backbone'
    ], function(Backbone ){
    
    
        var InterfaceRouter = Backbone.Router.extend({
      
            routes: {},

            renderView : function( view ){
      
                require([
                    view
                    ], function(view){
                        view.render();
                    });

            }
    
        });

        return InterfaceRouter;
  
    });
