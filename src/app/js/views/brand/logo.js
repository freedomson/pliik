define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/brand/logo.jade',
    'order!eve',
    'order!Raphael',
    'order!libs/raphael/raphael-letter-path-plugin',
    'order!libs/fonts/Vegur.font',
    'order!brequire',
    'order!fs',
    'order!jade'
    ], function($, _, Backbone, template){

        var brandLogoView = Backbone.View.extend({

            el: $('#logo'),
            
            company: 'pliikjjjjjjjjjjjjjjjj',

            template: jade.render(template),

            render: function(){


                // Using Jade Templating
                this.el.html(this.template);

                var paper = new Raphael($(this.el.selector).attr('id'), 500, 80)
                var letters = paper.printLetters(
                    50,
                    50, 
                    this.company, 
                    paper.getFont("Vegur"),
                    40
                    );

                var logoColors = [
                "red","orange","blue","pink","green"
                ]                                    
                
                for(var i=0,icolor=0; i<letters.length; i++, icolor++) {
                    
                    //... reset color
                    if ( i == logoColors.length ) icolor = 0;
                    
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
