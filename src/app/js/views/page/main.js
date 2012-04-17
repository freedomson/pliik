define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/page/main.html',
  'text!templates/brand/logo.html',
  'order!brequire',
  'order!fs',
  'order!jade'
], function($, _, Backbone, mainPageTemplate, brandLogoTemplate){

  var mainPageView = Backbone.View.extend({

    render: function(){


      if ( ! $(".container-template-main")[0] ) {
          
        $("body").html(jade.compile(mainPageTemplate));

        $("#logo").html(jade.compile(brandLogoTemplate));
      
      }


    }
  });
  
  return new mainPageView;
  
});