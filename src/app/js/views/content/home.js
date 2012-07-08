define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/content/home.jade',
    'Raphael',
    'jade'
    ], function($, _, Backbone, mainHomeTemplate, Raphael,jade){

        var mainHomeView = Backbone.View.extend({

            render: function(){
        
                // Using Jade Templating
               $("#page").html(jade.render(mainHomeTemplate));

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

            }
        });
  
        return new mainHomeView;
  
    });
