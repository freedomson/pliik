define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/users/signup.jade',
  'jade'
], function($, _, Backbone, usersSignupTemplate,jade){

  var mainHomeView = Backbone.View.extend({

    navigation : "Signup",
    
    el: $('#page'),
    
    template: jade.render(usersSignupTemplate),
    
    events : {
      
      "click #signupButton" : "signupUser"
        
    },

    signupUser : function() {
      
        console.log('Logging in User');
        
    },

    render: function(){
        
      // Using Jade Templating
      this.el.html(this.template);

    }
  });
  
  return new mainHomeView;
  
});
