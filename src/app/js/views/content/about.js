define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/content/about.jade',
  'jade'
], function($, _, Backbone, template, jade){

  var view = Backbone.View.extend({

    navigation : "About",
    
    render: function(){
        
      // Using Jade Templating
      $("#page").html(jade.render(template));



    }
  });
  
  return new view;
  
});
