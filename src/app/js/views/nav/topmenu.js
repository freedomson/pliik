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
    'i18n!nls/i18n',
    'jade'
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
        translate,
        jade){

        var view = Backbone.View.extend({

            el: $('#topmenu'),
            
            // template: jade.render(template),
            
           
            menuitems : [
              
            {
                title : 'Pliik',
                route : Util.parseURL(''),
                id:'logo',
                cssclass : 'topmenu-link logo',
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
                

                // logger.log("$('."+css+"').button();",4);
                
                var TplMustacheCompiled = Mustache.to_html(template, view);
                
                var TplJadeCompiled =  jade.render(TplMustacheCompiled)
               
                
                $('#topmenu').html( TplJadeCompiled );
                
                brandLogoView.render();
                
                this.bind();
                
            },

            /**
             * 
             * Only bind element at rendertime
             * 
             */

            
            bind : function(){
                
                $( "#logo" ).bind( "click", function(event, ui) {

  
                    if ($('#langmenu').is(':hidden'))
                    {
                        // handle non visible state
                        $('#langmenu').show('slow');
                        
                    }else{
                        
                        $('#langmenu').hide('slow');
                    
                    }
                
                });
            }  
            

        });
  
        return new view;
  
    });