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

            padding : 8,
            
            width : 180,
            
            height : 180,
            
            easing : '<>',
            
            speed : config.animation.speed,

            render: function(config){
                
                // +--------------------------------------------- 
                // | Create Paper
                // +---------------------------------------------

                this.paperInstance = new paper;
                this.paper = this.paperInstance.createPaper(
                {
                    paper:{
                        id:'center',
                        width: this.width,// width
                        height: this.height,// height
                    }
                });                
                
                // +--------------------------------------------- 
                // | Create satellite control button TOP
                // +---------------------------------------------

                this.btn_sat1 = new button;
                this.btn_sat1.render({
                    circle : {

                        x : this.paper.width/2, // x coordinate of the centre                
                        y : this.paper.height/2,// y coordinate of the centre
                        radius: this.paper.width/10 // radius

                    },
                    paper:this.paper});
                    
                // +--------------------------------------------- 
                // | Create satellite control button BOTTOM
                // +---------------------------------------------
                
                this.btn_sat2 = new button;
                this.btn_sat2.render({
                    circle : {

                        x : this.paper.width/2, // x coordinate of the centre           
                        y : this.paper.height/2,// y coordinate of the centre
                        radius: this.paper.width/10 // radius

                    },
                    paper:this.paper});
                    
                // +--------------------------------------------- 
                // | Create satellite control button LEFT
                // +---------------------------------------------
                
                this.btn_sat3 = new button;
                this.btn_sat3.render({
                    circle : {

                        x : this.paper.width/2, // x coordinate of the centre           
                        y : this.paper.height/2,// y coordinate of the centre
                        radius: this.paper.width/10 // radius

                    },
                    paper:this.paper});    
                    
                // +--------------------------------------------- 
                // | Create satellite control button RIGHT
                // +---------------------------------------------
                
                this.btn_sat4 = new button;
                this.btn_sat4.render({
                    circle : {

                        x : this.paper.width/2, // x coordinate of the centre           
                        y : this.paper.height/2,// y coordinate of the centre
                        radius: this.paper.width/10 // radius

                    },
                    paper:this.paper});                    
                                                    
                // +--------------------------------------------- 
                // | Create main control button CENTER
                // +---------------------------------------------
                
               
                this.btn_center = new button;
                this.btn_center.render({
                    circle : {

                        x : this.paper.width/2, // x coordinate of the centre                
                        y : this.paper.height/2,// y coordinate of the centre
                        radius: this.paper.width/4 // radius

                    },
                    iconsetup :{
                        
                        path: config.icon
                        
                    },
                    paper:this.paper});  
                                         
                // +--------------------------------------------- 
                // | Satellite SET
                // +---------------------------------------------
                    
                
                /*
                var satArray = [];
                satArray.push(this.btn_sat1.buttonSet.items[0]);
                satArray.push(this.btn_sat2.buttonSet.items[0]);
                satArray.push(this.btn_sat3.buttonSet.items[0]);
                satArray.push(this.btn_sat4.buttonSet.items[0]);                                          

                this.satSet = this.paper.set(satArray);

                this.satSet.forEach(
                    function(el){                        
                                        
                        // el.hide();
                        return true;
                        
                    }
                );
                */
                
                
                                         
                // +--------------------------------------------- 
                // | Add Events 2 Control
                // +---------------------------------------------  
                              
                this.bind();
                    

                // +--------------------------------------------- 
                // | Return element
                // +---------------------------------------------  
                
                return this.paperInstance.config.paper.el;

            },

            
            /**
             * ************************************
             * Bind Button
             * ************************************
             */             
            bind : function(){
                
                var that = this;

                 this.btn_center.buttonSet.mousedown(
                      function(){
                       that.pressControl();
                      }
                  );
                  
                 this.btn_center.buttonSet.dblclick(
                      function(){
                       that.pressControl();
                      }
                  );                  

                 this.btn_center.buttonSet.mouseup(
                      function(){
                       that.releaseControl();
                      }
                  );                    

            },
            
            pressControl : function() {


                // TOP
                this.btn_sat1.buttonSet.animate({
                    cx: this.paper.width/2,
                    cy: this.paper.height/this.padding,                    
                }, this.speed, this.easing);

                // BOTTOM
                this.btn_sat2.buttonSet.animate({
                    cx: this.paper.width/2,
                    cy: this.paper.height-this.paper.height/this.padding,                    
                }, this.speed, this.easing);     

                // LEFT
                this.btn_sat3.buttonSet.animate({
                    cx: this.paper.width/this.padding,
                    cy: this.paper.width/2,                    
                }, this.speed, this.easing);  

                // RIGHT
                this.btn_sat4.buttonSet.animate({
                    cx: this.paper.width - this.paper.width/this.padding,
                    cy: this.paper.height/2,                    
                }, this.speed, this.easing);                                                                                             

            },
            
            releaseControl : function() {
              
                // TOP
                this.btn_sat1.buttonSet.animate({
                    cx: this.paper.width/2,
                    cy: this.paper.height/2,                    
                }, this.speed, this.easing);

                // BOTTOM
                this.btn_sat2.buttonSet.animate({
                    cx: this.paper.width/2,
                    cy: this.paper.height/2,                    
                }, this.speed, this.easing);     

                // LEFT
                this.btn_sat3.buttonSet.animate({
                    cx: this.paper.width/2,
                    cy: this.paper.width/2,                    
                }, this.speed, this.easing);  

                // RIGHT
                this.btn_sat4.buttonSet.animate({
                    cx: this.paper.width/2,
                    cy: this.paper.height/2,                    
                }, this.speed, this.easing);     
                  
            }    
            
        });
  
        return Controller;
  
    });
