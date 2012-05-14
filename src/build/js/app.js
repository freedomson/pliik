// Filename: app.js
define([
    'routers/app', // Request router.js
    
    'libs/pliik/module-loader'
    
    ], function(Router){
    
        var initialize = function(){
      
            // Pass in our Router module and call it's initialize function
            Router.initialize();
    
        }

        return { 
            
            initialize: initialize
            
        };
  
    });
