define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'config',
    'libs/pliik/util',
    'Mustache',
    'jade',
    'Logger'
    ], function(
        $, 
        _, 
        Backbone, 
        template, 
        config, 
        util, 
        Mustache,
        jade,
        logger
        ){

        var view = Backbone.View.extend({

            el: $('#langmenu'),
            
            events: {
                "mouseover .langmenu-link" : "clickd"
            },
            
            renderTemplate : function(){
                
                util.updateCleanRoute();  
 
                var menuitems = [];

                _.each(config.i18n.active, function(item){ 

                   menuitems.push(
                                {
                                    title : item,
                                    route : 'javascript:window.location.href="' + config.site.root + util.parseURL_langmenu(
                                        util.cleanRoute
                                        ,item
                                    )+'";window.location.reload();',
                                    cssclass:'langmenu-link'    
                                });

                }); 
  
  
                //... Render Top Menu
                var viewData = {
                    "menuitems" : menuitems
                };
                
                var TplMustacheCompiled = Mustache.to_html(template, viewData);
                
                var TplJadeCompiled =  jade.render(TplMustacheCompiled);
                
                return TplJadeCompiled;
                
            },
  
            clickd : function(){
              
              logger.log('---Selected Language Link---',3);  
              logger.log(arguments,3);  
            
            },
            
            render: function(){

                logger.log("---Rendering LangMenu---",3);  
                
                $('#langmenu').html( this.renderTemplate() );

            }
        });
  
        return new view;
  
    });