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
    'button',
    'paper'
    ], function($, _, Backbone, mainHomeTemplate, Raphael,
    jade,Mustache,logger,config,button,paper){

        var Controller = Backbone.View.extend({
       
            logcode : 'Controller',

            render: function(config){
                
                // +--------------------------------------------- 
                // | Create Paper
                // +---------------------------------------------

                this.paperInstance = new paper;
                this.paper = this.paperInstance.createPaper({paper:{id:'center'}});
                

                // +--------------------------------------------- 
                // | Create main control button
                // +---------------------------------------------
                
                this.btn_center = new button;
                this.btn_center.render({paper:this.paper});
                
                logger.log('this.btn_center',this.logcode);               
                logger.log(this.btn_center.config,this.logcode);
                logger.log(this.btn_center,this.logcode);  
                
                // +--------------------------------------------- 
                // | Create satellite control button
                // +---------------------------------------------
                
                this.btn_sat1 = new button;
                this.btn_sat1.render({paper:this.paper});
                
                logger.log('this.btn_sat1',this.logcode);               
                logger.log(this.btn_sat1.config,this.logcode);
                logger.log(this.btn_sat1,this.logcode);                  
                
                              

                return this.paperInstance.config.paper.el;

            },

            bind : function(){}
            
        });
  
        return Controller;
  
    });
