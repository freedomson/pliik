define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/nav/menu.jade',
    'libs/pliik/module-loader',
    'config',
    'libs/pliik/util',
    'Mustache',
    'Logger',
    'views/brand/logo',
    'i18n!nls/i18n',
    'jade'
    ], function(
        $, 
        _, 
        Backbone, 
        template, 
        modules, 
        config, 
        Util, 
        Mustache,
        logger,
        brandLogoView,
        translate,
        jade){

        var ViewInterface = Backbone.View.extend({

            el: null,
            
            tplsetup : {},
           
            menuitems : [],
            
            render: function(){}

        });
  
        return ViewInterface;
  
    });