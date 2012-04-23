define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'libs/pliik/module-loader'
    ], function($, _, Backbone, template, modules){

        var view = Backbone.View.extend({

            el: $('#menu-container'),
            
            template: jade.render(template),
            
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

                $.each(modules.list, function(index, value) { 

                    that.menuitems.push(require(value));

                });
                
                console.log(that.menuitems)
  
                $('#menu').html(
                    Mustache.to_html(this.template, view)
                    );


            }
        });
  
        return new view;
  
    });