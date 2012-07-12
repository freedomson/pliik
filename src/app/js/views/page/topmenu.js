define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'libs/pliik/module-loader',
    'config',
    'libs/pliik/util',
    'Mustache',
    'Logger',
    'views/brand/logo',
    'i18n!nls/i18n'
    ], function(
        $, 
        _, 
        Backbone, 
        template, 
        modules, 
        config, 
        Util, 
        Mustache,
        logger,
        brandLogoView,
        translate){

        var view = Backbone.View.extend({

            el: $('#menu-container'),
            
            // template: jade.render(template),
                  
            menuitems : [
              
            {
                title : 'Pliik',
                route : Util.parseURL(''),
                id:'logo',
                cssclass : 'logo',
                jqm : {
                    datamini : config.jquerymobile.datamini,
                    datatheme: config.jquerymobile.datathemeactivetopmenu
                }
            }/*,{
                title : 'Signup',
                route : Util.parseURL('/users/signup')
            },
            {
                title : 'Login',
                route : Util.parseURL('/users/login')
            },
            {
                title : 'Project List',
                route : Util.parseURL('/projects')
            },{
                title : 'User List',
                route : Util.parseURL('/users')
            }*/
            ,{
                id    : 'about',
                title : translate.page.about.title,
                route : Util.parseURL('/content/about'),
                jqm : {
                    datamini : config.jquerymobile.datamini,
                    datatheme: config.jquerymobile.datatheme
                }
            }
                
            ],
            
            render: function(){

                var that = this;

                //... Load available Modules into Top Menu
                /*
                $.each(
                    modules.configurators,       
                    function(index, value) { 

                        _.each(require(value).menu, function(item){ 
                            
                            item.route = Util.parseURL(item.route);
                            item.jqm = {
                                datamini:config.jquerymobile.datamini,
                                datatheme: config.jquerymobile.datatheme
                            }
                            that.menuitems.push(item);
                            
                        }); 
                        
                    });
  
                */
                
                //... Render Top Menu
                var view = {
                    "menuitems" : that.menuitems
                };
                
                
                logger.log(translate,888888);
                
                logger.log("---ViewData at TopMenu Before Render---",4);
                logger.log(view,4);

                logger.log("---Util at TopMenu Before Render---",4);
                logger.log(Util,4);
                
                var css = config.jquerymobile.cssname.button
                
                logger.log("$('."+css+"').button();",4);
                
                var TplMustacheCompiled = Mustache.to_html(template, view);
                
                var TplJadeCompiled =  jade.render(TplMustacheCompiled)
               
                
                $('#topmenu').html( TplJadeCompiled );
                
                brandLogoView.render();
                
            }
        });
  
        return new view;
  
    });