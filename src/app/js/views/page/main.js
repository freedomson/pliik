define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/main.jade',
    'order!libs/less/less-1.3.0.min',
    'text!../../../css/style.less',
    'order!brequire',
    'order!fs',
    'order!jade',
    'order!libs/mustache/mustache'
    ], function($, _, Backbone, mainPageTemplate,less,cssCode){

        var mainPageView = Backbone.View.extend({

            render: function(){

                // Only render main template if not already present.
        
                if ( ! $(".container-template-main")[0] ) {
          
                    /***********************************************
                    * CSS Less
                    ************************************************/ 
                   
                    var cssParsedCode;
                    var parser = new(less.Parser);
                    parser.parse(cssCode,function (e, tree) {
                        cssParsedCode = tree.toCSS({
                            compress: true
                        }); // Minify CSS output
                    });
        
                    var view = {
                        css : cssParsedCode  
                    };
   
                    /***********************************************
                    * Template
                    ************************************************/ 
                   
                    $("body").html(
                        Mustache.to_html(jade.render(mainPageTemplate), view)
                        );
      
                }


            }
        });
  
        return new mainPageView;
  
    });