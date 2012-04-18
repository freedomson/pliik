// Filename: router.js
define([
    'jQuery',
    'Underscore',
    'Backbone'
    ], function($, _, Backbone ){
    
    
        var InterfaceRouter = Backbone.Router.extend({
      
            routes: {},

            renderView : function( view ){
      
                require([
                    'views/page/main'
                    ], function(view){
                        view.render();
                    });
      
                require([
                    view
                    ], function(view){
                        view.render();
                    });

            }
    
        });

        return InterfaceRouter;
  
    });
