define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'libs/pliik/module-loader'
    ], function($, _, Backbone, template, modules){

        var view = Backbone.View.extend({

            el: $('#menu-container'),
            
            // template: jade.render(template),
            
            menuitems : [
                
            {
                title : 'Home',
                route : '/'
            },{
                title : 'Signup',
                route : '/users/signup'
            },
            {
                title : 'Login',
                route : '/users/login'
            },
            {
                title : 'Project List',
                route : '/projects'
            },{
                title : 'User List',
                route : '/users'
            },{
                title : 'Open Source',
                route : '/content/opensource'
            }
                
            ],
            
            render: function(){

                var that = this;

                //... Load available Modules into Top Menu
                $.each(
                    modules.configurators,       
                    function(index, value) { 
                        _.each(require(value).menu, function(item){ 
                            that.menuitems.push(item);
                        });                    
                    });
  
  
                //... Render Top Menu
                var view = {
                    "menuitems" : that.menuitems  
                };
                
                var TplMustacheCompiled = Mustache.to_html(template, view);
                var TplJadeCompiled =  jade.render(TplMustacheCompiled)
                
                $('#menu').html( TplJadeCompiled );

            }
        });
  
        return new view;
  
    });