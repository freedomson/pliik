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

                var paper = Raphael("canvas", 800, 300);
      
                paper.circle(100, 150, 50).animate({
                    fill: "red", 
                    stroke: "#ccc", 
                    "stroke-width": 50, 
                    "stroke-opacity": 0.8
                }, 2000);

                paper.circle(300, 150, 50).animate({
                    fill: "green", 
                    stroke: "#ccc", 
                    "stroke-width": 50, 
                    "stroke-opacity": 0.8
                }, 2000);

                paper.circle(500, 150, 50).animate({
                    fill: "blue", 
                    stroke: "#ccc", 
                    "stroke-width": 50, 
                    "stroke-opacity": 0.8
                }, 2000);


            }
        });
  
        return new mainHomeView;
  
    });
