define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/template.jade',
    'order!libs/less/less-1.3.0.min',
    'text!../../../css/style.less',
    'views/brand/logo',
    'order!brequire',
    'order!fs',
    'order!jade',
    'order!libs/mustache/mustache'
    ], function($, _, Backbone, mainPageTemplate,less,cssCode,brandLogoView){

        var mainPageView = Backbone.View.extend({

            el: $('body'),
            
            template: jade.render(mainPageTemplate),
            
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
                   
                    this.el.html(
                        Mustache.to_html(this.template, view)
                        );
                            
                    //... Render Logo template
                    brandLogoView.render();                            
      
                }


            }
        });
  
        return new mainPageView;
  
    });