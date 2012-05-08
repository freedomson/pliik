define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/brand/logo.jade',
    'config',
    'order!Raphael',
    //'order!brequire',
    //'order!fs',
    'order!jade'
    ], function($, _, Backbone, template, Config, Raphael, jade){

        var brandLogoView = Backbone.View.extend({

            el: $('#container_logo'),
            
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

                var paper = new Raphael($(this.el.selector).attr('id'), 200, 50)
     
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
