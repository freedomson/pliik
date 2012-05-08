define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/content/opensource.jade',
  //'order!Raphael',
  //'order!brequire',
  //'order!fs',
  'order!jade'
], function($, _, Backbone, template, jade){

  var view = Backbone.View.extend({

    navigation : "Open Source",
    
    render: function(){
        
      // Using Jade Templating
      $("#page").html(jade.render(template));



    }
  });
  
  return new view;
  
});
