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
                "click .langmenu-link" : "loadLang"
            },
            
            renderTemplate : function(){
                
                util.updateCleanRoute();  
 
                var menuitems = [];

                _.each(config.i18n.active, function(item){ 

                   menuitems.push(
                                {
                                    title : item,
                                    route : util.parseURL_langmenu(
                                        util.cleanRoute
                                        ,item
                                    ),
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
  
            loadLang : function(event){
              
              logger.log('---Selected Language Link---',3);  
              
              logger.log(event.currentTarget.href,3);  
              
              event.preventDefault();
              
              window.location.href=event.currentTarget.href;
              
              window.location.reload();
            
            },
            
            render: function(){

                logger.log("---Rendering LangMenu---",3);  
                
                $('#langmenu').html( this.renderTemplate() );

            }
        });
  
        return new view;
  
    });