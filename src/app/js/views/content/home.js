define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/content/home.jade',
    'Raphael',
    'jade',
    'button',
    'Logger'
    ], function($, _, Backbone, mainHomeTemplate, Raphael,jade,button,logger){

        var mainHomeView = Backbone.View.extend({

            name : 'home',
            
            config : {
              
                buttons : {
                    
                    chat : {

                        title : "MyLoungePhone",
                        
                        icon : 'market'

                    }
                    
                }
                
            },
            
            
            initialize: function(){

                this.createButtons();

            },
            

            buttons : [],
            
            createButtons : function(){
                
                var that = this;
                
               _.each(this.config.buttons, function(item){
                   
                   that.buttons.push(button.render(item));
                   
               });
                
            },

            render: function(){
        
               $("#page").html(jade.render(mainHomeTemplate));

               $("#page").append(this.buttons);     

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
