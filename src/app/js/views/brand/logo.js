define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/brand/logo.jade',
    'libs/pliik/pliik.config',
    'order!eve',
    'order!Raphael',
    'order!libs/vendor/raphael/raphael-letter-path-plugin',
    // 'order!libs/vendor/fonts/Vegur.font',
    'order!libs/vendor/fonts/Abel.font',
    'order!brequire',
    'order!fs',
    'order!jade'
    ], function($, _, Backbone, template, pliikConfig){

        var brandLogoView = Backbone.View.extend({

            el: $('#logo'),
            
            company: pliikConfig.entity,
            
            font: 'Abel', // Vegur

            template: jade.render(template),

            render: function(){


                // Using Jade Templating
                this.el.html(this.template);

                var paper = new Raphael($(this.el.selector).attr('id'), 500, 50)
                var letters = paper.printLetters(
                    30,
                    30, 
                    this.company, 
                    paper.getFont(this.font),
                    50
                    );

                var logoColors = [
                    "red","green","blue"
                ]                                    
                
                for(var i=0,icolor=0; i<letters.length; i++, icolor++) {
                    
                    //... reset color
                    if ( i%logoColors.length == 0 ) icolor = 0;
                    
                    letters[i].attr({
                        fill: logoColors[icolor] , 
                        "stroke-width":"0", 
                        stroke:"#3D5C9D"
                    })
                }

            }
    
    
        });
  
        return new brandLogoView;
  
    });
