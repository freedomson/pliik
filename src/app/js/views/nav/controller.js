define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/nav/button.jade',
    'Raphael',
    'jade',
    'Mustache',
    'Logger',
    'config',
    'button'
    ], function($, _, Backbone, mainHomeTemplate, Raphael,
    jade,Mustache,logger,config,button){

        var controller = Backbone.View.extend({
       
            ctl_center : {},

            render: function(config){
                
                
                this.ctl_center = new button;
                
                this.ctl_center.render(config);
                
                this.ctl_nav1 = new button;
                
                this.ctl_nav1.render({width:50,height:50,id:'add'});
                
                //this.ctl_center.paper.add(this.ctl_nav1);
                
                return this.ctl_center.buttonEl;


            },

            bind : function(){}
            
        });
  
        return controller;
  
    });
