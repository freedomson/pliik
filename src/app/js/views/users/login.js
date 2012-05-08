define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/users/login.jade',
  'order!Raphael',
  'order!brequire',
  'order!fs',
  'order!jade'
], function($, _, Backbone, usersLoginTemplate){

  var usersLoginView = Backbone.View.extend({

    navigation : "Login",
    
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
  
  return new usersLoginView;
  
});
