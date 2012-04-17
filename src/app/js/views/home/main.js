define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/home/main.html',
  'order!eve',
  'order!Raphael',
  'order!brequire',
  'order!fs',
  'order!jade'
], function($, _, Backbone, mainHomeTemplate){

  var mainHomeView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
        
        
      // this.el.html(mainHomeTemplate);
  
      // Using Jade Templating
      this.el.html(jade.compile(mainHomeTemplate));

      
      var paper = Raphael("canvas", 640, 480);
      
      paper.circle(320, 240, 60).animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);

    }
  });
  return new mainHomeView;
});
