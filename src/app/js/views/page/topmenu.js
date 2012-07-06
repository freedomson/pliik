define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/menu.jade',
    'libs/pliik/module-loader',
    'config',
    'libs/pliik/util',
    'Mustache',
    'Logger'
    ], function(
        $, 
        _, 
        Backbone, 
        template, 
        modules, 
        config, 
        Util, 
        Mustache,
        logger){

        var view = Backbone.View.extend({

            el: $('#menu-container'),
            
            // template: jade.render(template),
                  
            menuitems : [
                
            {
                title : 'Home',
                route : Util.parseURL(''),
                jqm : {
                    datamini : config.jquerymobile.datamini,
                    datatheme: config.jquerymobile.datatheme
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
            }*/,{
                title : 'Open Source',
                route : Util.parseURL('/content/opensource'),
                jqm : {
                    datamini : config.jquerymobile.datamini,
                    datatheme: config.jquerymobile.datatheme
                }
            }
                
            ],
            
            render: function(){

                var that = this;

                //... Load available Modules into Top Menu
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
  
  
                //... Render Top Menu
                var view = {
                    "menuitems" : that.menuitems
                };
                
                
                logger.log("---ViewData at TopMenu Before Render---",4);
                logger.log(view,4);

                logger.log("---Util at TopMenu Before Render---",4);
                logger.log(Util,4);
                
                logger.log("$('.pliik-menu-item').button();",4);
                
                var TplMustacheCompiled = Mustache.to_html(template, view);
                var TplJadeCompiled =  jade.render(TplMustacheCompiled)
                
                $('#topmenu').html( TplJadeCompiled );
                
            }
        });
  
        return new view;
  
    });