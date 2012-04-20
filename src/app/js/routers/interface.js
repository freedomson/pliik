// Filename: router.js
define([
    'jQuery',    
    'Backbone',
    'libs/pliik/config'    
    ], function($,Backbone,config ){
    
    
        var InterfaceRouter = Backbone.Router.extend({
      
            routes: {},


            //... Set Document Navigation Title
            setDocumentTitle : function(view) {

                var navigation = '';
                        
                if ( typeof view.navigation != 'undefined' ) {
                            
                    navigation = view.navigation + config.document.title.separator + config.entity;
                            
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