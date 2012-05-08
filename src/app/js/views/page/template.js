define([
    'jQuery',
    'Backbone',
    'text!templates/page/template.jade',
    'less',
    'text!../../../css/style.css',
    'views/brand/logo',
    'views/page/menu',   
    'views/page/footer',  
    'jade',
    'Mustache'
    ], function
        (
        $, 
        Backbone, 
        mainPageTemplate,
        less,
        cssCode,
        brandLogoView,
        pageMenuView,
        pageFooterView,
        jade,
        Mustache
        ){

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
                    
                    //... Render Menu template
                    pageMenuView.render();      
                    
                    //... Render Footer template
                    pageFooterView.render();
      
                }


            }
        });
  
        return new mainPageView;
  
    });