define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/users/login.jade',
  'order!eve',
  'order!Raphael',
  'order!brequire',
  'order!fs',
  'order!jade'
], function($, _, Backbone, usersLoginTemplate){

  var mainHomeView = Backbone.View.extend({

    render: function(){
        
      // Using Jade Templating
      $("#page").html(jade.render(usersLoginTemplate));

    }
  });
  
  return new mainHomeView;
  
});
