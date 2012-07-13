
// Filename: router.js
define(
    [
    'jQuery', 
    'Underscore',
    'Backbone',
    'config',
    'i18n!nls/i18n',
    'Logger' 
    ], function($,_,Backbone,config,lang,logger){
    
    
        var InterfaceRouter = Backbone.Router.extend({
                      
            name : 'InterfaceRouter',
                                   
            i18n : false,
                       
            initialize : function(){
                
                //... Activate languages routes
                this.activateLanguageRoutes();
                              
            },
            
            activateLanguageRoutes : function(){
                 
                //... this.i18n
                var i18n = this.i18n || lang;
                
                //... Activate languages routes
                var newRoutes = {};
                               
                _.each(this.routes,function(name,value){
                
                    // Root
                    newRoutes[value]=name;
                    
                    // Root + lang
                    newRoutes[value+'/:lang']=name;
                    
                    // Translated
                    newRoutes[i18n.routes[value]]=name;
                    
                    // Translated+lang
                    newRoutes[i18n.routes[value]+'/:lang']=name;
                    
                });           
                 
                this.routes = newRoutes;
                
                this._bindRoutes();
                
            },
      
            routes: {},

            //... Set Document Navigation Title
            setDocumentTitle : function(view) {

                var navigation = '';
                        
                if ( typeof view.navigation != 'undefined' ) {
                            
                    navigation = view.navigation + ' ' + config.entity;
                            
                } else {
                            
                    navigation = config.entity;
                            
                }
                
                $(document).attr("title", navigation); 
                
            },

            //... Render View
            renderView : function( view ){
                 
                logger.log("---Rendering View---",3);  
                logger.log("view:"+view,3);
                
                
                logger.log("$.mobile.showPageLoadingMsg();",4);
                
                $.mobile.showPageLoadingMsg();
                      
                var router = this;
                
                
                require([
                    
                    view,
                    'views/page/langmenu'
                    
                    ], function(view,viewlangmenu){
                        
                        //... Set window title
                        router.setDocumentTitle(view);
                        
                        // Set default page background
                        // TODO: export to internal method
                        // $(".ui-page").css({ "background-image" : "none"});
                        
                        //... Render request view
                        view.render();
                        
                        //... Update Langmenu Links and load view
                        viewlangmenu.render();

                       // Home view
                       // TODO: Move to observer for views
                       if (view.name == 'home') {

                                $('#langmenu').hide('slow');
                                
                       }
 
                        
                        
                        $.mobile.hidePageLoadingMsg();
                        
                        //$("#page").css({ "background-image" : "none"});
                             
                });
                     
                                     
                // TODO: Backbone Observer Pattern On This Please!
                // $('.pliik-menu-item-mobile').button(); 
                
            }
    
        });

        return InterfaceRouter;
        
  
    });
