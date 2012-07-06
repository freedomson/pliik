// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.


require.config({
    
    paths: {
        loader: 'libs/vendor/backbone/loader',
        jQuery: 'libs/vendor/jquery/jquery',
        Underscore: 'libs/vendor/underscore/underscore',
        Backbone: 'libs/vendor/backbone/backbone',
        templates: '../templates',
        modules: '../modules',
        // eve: 'libs/vendor/eve/eve.min',
        Raphael: 'libs/vendor/raphael/raphael-min',
        // brequire: 'libs/vendor/brequire/brequire',
        // fs: 'libs/vendor/fs/fs',   
        jade: 'libs/vendor/jade/jade',
        less: 'libs/vendor/less/less-1.3.0.min',
        text: 'libs/vendor/require/text',
        order: 'libs/vendor/require/order',
        i18n: 'libs/vendor/require/i18n',
        util: 'libs/pliik/util',
        lang: 'libs/pliik/lang',
        Mustache : 'libs/vendor/mustache/mustache',
        Logger : 'libs/pliik/logger'
    }    

});

require([

    // Load our app module and pass it to our definition function
    'libs/pliik/module-loader',
    'config',
    'Underscore',
    'lang'
    
    // Some plugins have to be loaded in order due to their non AMD compliance
    // Because these scripts are not "modules" they do not pass any values to the definition function below
    ], function(Modules,Config,_,Lang){
        
           
        // Show Loading Mask
        // TODO: Move to external object Mobile
        $.mobile.showPageLoadingMsg();
           
        // Initialize Language engine
        Lang.initialize();

        // The "app" dependency is passed in as "App"
        // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function        

        //... Force Syncronized Module Load
        require(
        
            _.union(
            
                ['app','jQuery'], // App Module
                
                Modules.loadPaths // Plugin Modules - Auto Load
                
            )   
            
            , function(App,$){


                    
                    App.initialize();
                    

            
            });

        
    });