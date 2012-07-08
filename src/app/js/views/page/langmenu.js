define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'config',
    'libs/pliik/util',
    'Mustache',
    'jade',
    'Logger',
    'lang'
    ], function(
        $, 
        _, 
        Backbone, 
        template, 
        config, 
        util, 
        Mustache,
        jade,
        logger,
        lang
        ){

        var view = Backbone.View.extend({

            el: $('#langmenu'),
            
            events: {
                "click .langmenu-link" : "loadLang"
            },
            
            renderTemplate : function(){
                
                util.updateCleanRoute();  
 
                logger.log(util,4);
 
                var menuitems = [];


                _.each(config.i18n.active, function(item){

                
                    logger.log(item + "(item)==(config.i18n.selected)" + config.i18n.selected, 4);
                    logger.log(item + "(item)==(lang.active)" + lang.active, 4);
                    
                    var themeact = 
                        ( item == config.i18n.selected ) ?
                            config.jquerymobile.datathemeactive
                            : config.jquerymobile.datatheme
                            
                                    
                   
                   // Item Setup ~~~~~~~~~~~~~~~~~~~~~~~~~
                   menuitems.push(
                                {
                                    title : item,
                                    route : util.parseURL_langmenu(
                                        util.cleanRoute
                                        ,item
                                    ),
                                    cssclass:'langmenu-link',
                                    jqm : {
                                        datamini : config.jquerymobile.datamini,
                                        datatheme : themeact
                                    }
                                });

                }); 
  
  
                //... Render Top Menu
                var viewData = {
                    "menuitems" : menuitems
                };

                logger.log("langmenu",4);
                logger.log(viewData,4);
                logger.log(lang,4);
                logger.log(config,4);
                
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

                // TODO: Backbone Observer Pattern On This Please!
                $('.pliik-menu-item-mobile').button(); 

            }
        });
  
        return new view;
  
    });