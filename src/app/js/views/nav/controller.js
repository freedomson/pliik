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
                logger.log(this.ctl_center.config,this.logcode);
                
                
                // +--------------------------------------------- 
                // | Create satelite control button 1
                // +---------------------------------------------
                
                this.ctl_nav1 =  new button;
                this.ctl_nav1.render(
                    {
                        
                        id: 'btn_add__' + this.ctl_center.parentElID,
                        
                        paper : {
                            el : this.ctl_center.config.paper.el,
                            width: 50,
                            height: 50                            
                        },
                        
                        circle : {
                        
                            x : '50%', // x coordinate of the centre                
                            y : '50%',// y coordinate of the centre
                            radius: '30' // radius
                        
                        },                        
                        
                        title : "Add",
                        icon : 'Add'


                    }
                );
                
                this.ctl_nav1.buttonSet.transform("t185,54.5r0t-100,0");
                    
                
                logger.log('this.ctl_nav1+'+'btn_add__' + this.ctl_center.parentElID,this.logcode);               
                logger.log(this.ctl_nav1,this.logcode);         
                
                /*
                // +--------------------------------------------- 
                // | Create satelite control button 2
                // +---------------------------------------------
                
                this.ctl_nav2 =  new button;
                this.ctl_nav2.render(
                    {
                        
                        id: 'btn_remove__' + this.ctl_center.parentElID,
                        
                        paper : {
                            el : this.ctl_center.config.paper.el,
                            width: 50,
                            height: 50                            
                        },
                        
                        circle : {
                        
                            x : '50%', // x coordinate of the centre                
                            y : '50%',// y coordinate of the centre
                            radius: '10' // radius
                        
                        },     
                        
                        title : "Remove",
                        icon : 'Remove'


                    }
                );
                    
                
                logger.log('this.ctl_nav2+'+'btn_add__' + this.ctl_center.parentElID,this.logcode);               
                logger.log(this.ctl_nav2,this.logcode);                   
                */
                
                return this.ctl_center.config.paper.el;

            },

            bind : function(){}
            
        });
  
        return controller;
  
    });
