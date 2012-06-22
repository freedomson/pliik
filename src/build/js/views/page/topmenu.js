define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'libs/pliik/module-loader',
    'config',
    'libs/pliik/util',
    'Mustache'
    ], function(
        $, 
        _, 
        Backbone, 
        template, 
        modules, 
        Config, 
        Util, 
        Mustache){

        var view = Backbone.View.extend({

            el: $('#menu-container'),
            
            // template: jade.render(template),
            
            menuitems : [
                
            {
                title : 'Home',
                route : Util.parseURL('')
            },{
                title : 'Signup',
                route : Util.parseURL('/users/signup')
            },
            {
                title : 'Login',
                route : Util.parseURL('/users/login')
            },
            {
                title : 'Project List',
                route : Util.parseURL('/projects')
            },{
                title : 'User List',
                route : Util.parseURL('/users')
            },{
                title : 'Open Source',
                route : Util.parseURL('/content/opensource')
            }
                
            ],
            
            render: function(){

                var that = this;

                //... Load available Modules into Top Menu
                $.each(
                    modules.configurators,       
                    function(index, value) { 

                        _.each(require(value).menu, function(item){ 
                            
                            item.route = Util.parseURL(item.route);
                            that.menuitems.push(item);
                            
                        }); 
                        
                    });
  
  
                //... Render Top Menu
                var view = {
                    "menuitems" : that.menuitems
                };
                
                var TplMustacheCompiled = Mustache.to_html(template, view);
                var TplJadeCompiled =  jade.render(TplMustacheCompiled)
                
                $('#topmenu').html( TplJadeCompiled );

            }
        });
  
        return new view;
  
    });