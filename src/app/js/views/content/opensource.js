define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/content/opensource.jade',
  'order!eve',
  'order!Raphael',
  'order!brequire',
  'order!fs',
  'order!jade'
], function($, _, Backbone, template){

  var view = Backbone.View.extend({

    navigation : "Open Source",
    
    render: function(){
        
      // Using Jade Templating
      $("#page").html(jade.render(template));



    }
  });
  
  return new view;
  
});
