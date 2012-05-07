// https://github.com/jrburke/r.js/blob/master/build/example.build.js
// http://addyosmani.com/writing-modular-js/
({
    appDir: "app",
    baseUrl: "./js",
    dir: "build",
    skipModuleInsertion: true,
    optimizeAllPluginResources: false,
    findNestedDependencies: true,
    inlineText: true,
    locale: "en-US",
    
    //How to optimize all the JS files in the build output directory.
    //Right now only the following values
    //are supported:
    //- "uglify": (default) uses UglifyJS to minify the code.
    //- "closure": uses Google's Closure Compiler in simple optimization
    //mode to minify the code. Only available if running the optimizer using
    //Java.
    //- "closure.keepLines": Same as closure option, but keeps line returns
    //in the minified files.
    //- "none": no minification will be done.
    optimize: "none",

    //If using UglifyJS for script optimization, these config options can be
    //used to pass configuration values to UglifyJS.
    //See https://github.com/mishoo/UglifyJS for the possible values.
    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true
    },
    
    paths: {
        loader: 'libs/vendor/backbone/loader',
        jQuery: 'libs/vendor/jquery/jquery',
        Underscore: 'libs/vendor/underscore/underscore',
        Backbone: 'libs/vendor/backbone/backbone',
        templates: '../templates',
        modules: '../modules',
        eve: 'libs/vendor/eve/eve.min',
        Raphael: 'libs/vendor/raphael/raphael-min',
        brequire: 'libs/vendor/brequire/brequire',
        fs: 'libs/vendor/fs/fs',   
        jade: 'libs/vendor/jade/jade',
        less: 'libs/vendor/less/less-1.3.0.min',
        text: 'libs/vendor/require/text',
        order: 'libs/vendor/require/order',
        i18n: 'libs/vendor/require/i18n',
        util: 'libs/pliik/util'
    },
    modules: [
        {
            name: "main" //,
            // include: [
                // "jQuery","Underscore","Backbone"
                // 'app',
                // 'libs/pliik/module-loader',
                // 'config',
                // 'libs/pliik/util',
                // 'views/page/template',
            // ]
        }/*,
        {
            name : 'views/page/template'  
        }*/
    ]
})
