define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/brand/logo.jade',
    'config',
    'Raphael',
    'jade',
    'Mustache'
    ], function($, _, Backbone, template, Config, Raphael, jade, Mustache){

        var brandLogoView = Backbone.View.extend({

            el: $('#logo_container'),
            
            company: Config.entity,
            
            font: 'Abel', // Vegur

            template: jade.render(template),

            render: function(){

                var view = {
                    url : Config.url,
                    entity : Config.entity
                };
   
                $("#logo").html(
                    Mustache.to_html(this.template, view)
                    );

                var paper = new Raphael($(this.el.selector).attr('id'), 300, 50)
     
                var letters = paper.printLetters(
                    30,
                    30, 
                    this.company, 
                    paper.getFont(this.font),
                    75
                    );

                var logoColors = [
                    "red","green","blue"
                ]                                    
                
                for(var i=0,icolor=0; i<letters.length; i++, icolor++) {
                    
                    //... reset color
                    if ( i%logoColors.length == 0 ) icolor = 0;
                    
                    letters[i].attr({
                        fill: logoColors[icolor] , 
                        "stroke-width":"2", 
                        stroke: logoColors[icolor]
                    })
                }

            }
    
    
        });
  
        return new brandLogoView;
  
    });
