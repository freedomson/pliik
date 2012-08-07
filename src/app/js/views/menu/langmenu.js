define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/nav/menu.jade',
    'config',
    'libs/pliik/util',
    'Mustache',
    'jade',
    'Logger',
    'lang',
    'i18n!nls/i18n',
    'libs/pliik/util',
    'views/menu/interface'
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
        lang,
        translate,
        Util,
        ViewInterface
        ){

        var view = ViewInterface.extend({

            el: $('#langmenu'),
            
            events: {
                "click .langmenu-link" : "loadLang"
            },
            
            renderTemplate : function(){
                
                Util.updateCleanRoute();  
 
                logger.log(util,4);
 
                var menuitems = [];

                // About Setup ~~~~~~~~~~~~~~~~~~~~~~~~~
                   
                menuitems.push(      
                {
                    id    : 'about',
                    title : translate.page.about.title,
                    route : Util.parseURL('/content/about'),
                    jqm : {
                        datamini : config.jquerymobile.datamini,
                        datatheme: config.jquerymobile.datatheme,
                        dataicon: 'info',
                        dataiconpos : 'left'
                    }
                });
                
                
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
            
            
            active : 0,
            
            render: function(view){

                             
                // TODO: Move to observer patter
                if (this.active==1 && view.name=='home') {

                    $('#langmenu').hide('slow');

                } else if ( view.name=='home' ) {
                    
                    $('#langmenu').hide(''); 
                    
                }

                logger.log("---Rendering LangMenu---",3);  
                
                $('#langmenu').html( this.renderTemplate() );

                // TODO: Backbone Observer Pattern On This Please!
                $('.pliik-menu-item-mobile').button(); 
                
                this.active = 1;

            }
        });
  
        return new view;
  
    });