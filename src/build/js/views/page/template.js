define([
    'jQuery',
    'Backbone',
    'text!templates/page/template.jade',
    'less',
    'text!../../../css/style.css',
    'views/brand/logo',
    'views/page/topmenu',
    'views/page/footer',  
    'jade',
    'Mustache',
    'lang'
    ], function
        (
        $, 
        Backbone, 
        mainPageTemplate,
        less,
        cssCode,
        brandLogoView,
        pageTopMenuView,
        pageFooterView,
        jade,
        Mustache,
        Lang
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
                    pageTopMenuView.render();     
                    
                    //... Render Footer template
                    pageFooterView.render();
                    
                    //... IMPORTANT
                    // Language Menu is Rendered at Routes Interface
                    
                }


            }
        });
  
        return new mainPageView;
  
    });