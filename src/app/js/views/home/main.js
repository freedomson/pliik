define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/home/main.jade',
  'order!eve',
  'order!Raphael',
  'order!brequire',
  'order!fs',
  'order!jade'
], function($, _, Backbone, mainHomeTemplate){

  var mainHomeView = Backbone.View.extend({

    render: function(){
        
      // Using Jade Templating
      $("#page").html(jade.render(mainHomeTemplate));

      var paper = Raphael("canvas", 640, 480);
      
      paper.circle(320, 240, 60).animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);

    }
  });
  
  return new mainHomeView;
  
});
