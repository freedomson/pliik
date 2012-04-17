// Filename: router.js
define([
  'jQuery',
  'Underscore',
  'Backbone',
], function($, _, Backbone ){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '/projects': 'showProjects',
      '/users': 'showUsers',
      
      // Default
      '*actions': 'defaultAction'
    },
    showProjects: function(){

        require([
            'views/page/main',
            'views/projects/list'
        ], function(mainPageView,projectListView){
            mainPageView.render();
            projectListView.render();
        });
      
    },
    
    
      // As above, call render on our loaded module
      // 'views/users/list'
    showUsers: function(){
        
        require([
            'views/page/main',
            'views/users/list'
        ], function(mainPageView,userListView){
            mainPageView.render();
            userListView.render();
        });
      
    },
    
    /**
     * DEFAULT ROUTE
     */
    defaultAction: function(actions){
        
        require([
            'views/page/main',
            'views/home/main'
        ], function(mainPageView,mainHomeView){
            mainPageView.render();
            mainHomeView.render();
        });
        
    }
    
  });

  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  
  return { 
    initialize: initialize
  };
  
});
