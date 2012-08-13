define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/content/home.jade',
    'Raphael',
    'jade',
    'views/nav/controller',
    'Logger'
    ], function($, _, Backbone, mainHomeTemplate, Raphael,jade,controller,logger){

        var mainHomeView = Backbone.View.extend({

            name : 'home',
            
            logcode : 6002,
            
            controls : [],
            
            config : {
                
                controllers : {
                    market : {
                        id : 'btn_market',
                        title : "Market",
                        icon : 'market'
                    },
                    
                    chat : {
                        id : 'btn_chat',
                        title : "Chat",
                        icon : 'chat'
                    }
                }
                
            },
            
            
            initialize: function(){

                this.createButtons();

            },
            

            controllers : [],
            
            createButtons : function(){
                
                var that = this;
                
               _.each(this.config.controllers, function(item){
                   
                   var ctl = new controller;

                   that.controls.push(ctl.render(item));
                   
               });
                
            },

            render: function(){
        
               $("#page").html(jade.render(mainHomeTemplate));

               $("#page").append(this.controls);     
               
               logger.log('this.controls',this.logcode);               
               logger.log(this.controls,this.logcode);
               
               // TODO: Extend from common page view
               // Put as class definition on common page view
               
               // $(".ui-page").css({ "background-image" : "url(pic/Blue_wave_of_water-wide.jpg)"});
               
               // Set Main Background Image
               /*
                var elemcss = '#page';
                $(elemcss).css({ "background-image" : "url(pic/Blue_wave_of_water-wide.jpg)"});
                $(elemcss).css({ "background-size" : "130%"});
                $(elemcss).css({ "background-repeat" : "no-repeat"});
                */
/*
                var paper = Raphael("canvas", 800, 200);
      
                paper.circle(100, 100, 70).animate({
                    fill: "red", 
                    stroke: "#444", 
                    "stroke-width": 30, 
                    "stroke-opacity": 0.8
                }, 2000);

                paper.circle(300, 100, 70).animate({
                    fill: "green", 
                    stroke: "#444", 
                    "stroke-width": 30, 
                    "stroke-opacity": 0.8
                }, 2000);

                paper.circle(500, 100, 70).animate({
                    fill: "blue", 
                    stroke: "#444", 
                    "stroke-width": 30, 
                    "stroke-opacity": 0.8
                }, 2000);
 */
            }
        });
  
        return new mainHomeView;
  
    });
