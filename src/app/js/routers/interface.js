// Filename: router.js
define(
    [
    'jQuery', 
    'Underscore',
    'Backbone',
    'config' 
    ], function($,_,Backbone,config){
    
    
        var InterfaceRouter = Backbone.Router.extend({
      
            initialize : function(){
                
                //... Activate languages routes
                this.activateLanguageRoutes();
                
            },
            
            activateLanguageRoutes : function(){
                 
                //... Activate languages routes
                var newRoutes = {};
                
                _.each(this.routes,function(name,value){
                
                    newRoutes[value]=name;
                    
                    newRoutes[value+'/:lang']=name;

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
