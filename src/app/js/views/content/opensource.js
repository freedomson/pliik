define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/content/opensource.jade',
  'jade'
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
