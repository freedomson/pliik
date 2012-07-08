define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/brand/logo.jade',
    'config',
    'Raphael',
    'jade',
    'Mustache',
    'libs/pliik/util',
    'Logger'
    ], function($, _, Backbone, template, 
    Config, Raphael, jade, Mustache, Util,logger){

        var brandLogoView = Backbone.View.extend({

            el: $('#logo_container'),
            
            company: Config.entity,
            
            font: 'Abel', // Vegur

            template: jade.render(template),

            render: function(){

                var view = {
                    url : Util.parseURL(''),
                    entity : Config.entity
                };
                
                $("#logo").html(
                    Mustache.to_html(this.template, view)
                    );

                var paper = new Raphael($($('#logo_container').selector).attr('id'), 120, 30)

                logger.log(paper,4);

                var letters = paper.printLetters(
                    10,
                    20, 
                    this.company, 
                    paper.getFont(this.font),
                    30
                    );

                var logoColors = [
                    "red","green","blue"
                ]                                    
                
                for(var i=0,icolor=0; i<letters.length; i++, icolor++) {
                    
                    //... reset color
                    if ( i%logoColors.length == 0 ) icolor = 0;
                    
                        /*var x= */
                        
                        letters[i].attr({
                        fill: logoColors[icolor] , 
                        "stroke-width":"1", 
                        stroke: logoColors[icolor]
                    })
                    
                    // try{x.rotate(10);}catch(e){}
                    
                }

                // try{letters.rotate(0);}catch(e){}
                
                /*letters.attr({
                    'stroke-width': 2,
                    'stroke': '#00aeef'
                });*/

            }
    
    
        });
  
        return new brandLogoView;
  
    });
