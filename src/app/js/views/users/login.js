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

    el: $('#page'),
    
    template: jade.render(usersLoginTemplate),
    
    events : {
      
      "click #loginButton" : "loginUser"
        
    },

    loginUser : function() {
      
        console.log('Logging in User');
        
    },

    render: function(){
        
      // Using Jade Templating
      this.el.html(this.template);

    }
  });
  
  return new mainHomeView;
  
});
