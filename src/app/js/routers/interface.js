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
            
            i18n : false,
            
            initialize : function(){
                
                // logger.log("Callig Route Interface Initialize");
                
                
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
            
                // logger.log("Router:Interface:activateLanguageRoutes");
                // logger.log(newRoutes);
                // logger.log(i18n);
                
            
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
      
                
                var router = this;
                
                require([
                    view                  
                    ], function(view){
                        
                        router.setDocumentTitle(view);
                        
                        view.render();
                        
                    });

            }
    
        });

        return InterfaceRouter;
        
  
    });
