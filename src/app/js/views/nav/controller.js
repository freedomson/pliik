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
       
            logcode : 6004,

            render: function(config){
                
                // +--------------------------------------------- 
                // | Create main control button
                // +---------------------------------------------
                
                this.ctl_center = new button;
                this.ctl_center.render(config);
                
                logger.log('this.ctl_center+'+config.id,this.logcode);               
                logger.log(this.ctl_center,this.logcode);
                
                
                // +--------------------------------------------- 
                // | Create satelite control button 1
                // +---------------------------------------------
                
                this.ctl_nav1 =  new button;
                this.ctl_nav1.render(
                    {
                        title : "Add",
                        icon : 'Add',
                        id: 'btn_add__' + this.ctl_center.parentElID,
                        parentEl : this.ctl_center.parentEl,
                        width: 50,
                        height: 50
                    }
                );
                    
                
                logger.log('this.ctl_nav1+'+'btn_add__' + this.ctl_center.parentElID,this.logcode);               
                logger.log(this.ctl_nav1,this.logcode);         
                
                // +--------------------------------------------- 
                // | Create satelite control button 2
                // +---------------------------------------------
                
                this.ctl_nav2 =  new button;
                this.ctl_nav2.render(
                    {
                        title : "Remove",
                        icon : 'Remove',
                        id: 'btn_remove__' + this.ctl_center.parentElID,
                        parentEl : this.ctl_center.parentEl,
                        width: 50,
                        height: 50
                    }
                );
                    
                
                logger.log('this.ctl_nav2+'+'btn_add__' + this.ctl_center.parentElID,this.logcode);               
                logger.log(this.ctl_nav2,this.logcode);                   
                
                
                return this.ctl_center.parentEl;

            },

            bind : function(){}
            
        });
  
        return controller;
  
    });
