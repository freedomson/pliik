//my/shirt.js now does setup work
//before returning its module definition.
define(    
    [
    'i18n!nls/i18n',
    'config',
    'nls/root/i18n',
    'Backbone',
    'Logger'
    ],
    function(i18n,config,rootlang,Backbone,logger) {

   
        String.prototype.lpad = function(padString, length) {
            var str = this;
            while (str.length < length)
                str = padString + str;
            return str;
        }    
    
    
        return {
            
            name : 'Util',
        
            cleanRoute : '',
            
            parsedURLRouteNetwork : [],
        
            parseURL : function(route){
                
                var originalRoute = i18n.routes[route] || route;
                
                var translatedRoute = '#' + originalRoute + '/' + config.i18n.selected;
                
                this.parsedURLRouteNetwork[originalRoute]=route;
                
                return translatedRoute;
                
            },
            
            parseURL_langmenu : function(route,languagecode){

                return '#' + route + '/' + languagecode;
                
            },
            
            updateCleanRoute : function(){
                
               // Each time renderView is called we recalculate 
                // the language menu based on the current route value 
                
                if (
                    Backbone.history.fragment != '' &&
                        Backbone.history.fragment != '/' + config.i18n.selected
                    ) {
               
                    var parsedFragment = Backbone.history.fragment.replace("/"+config.i18n.selected, "");
                    
                    var cleanRoute = this.parsedURLRouteNetwork[parsedFragment];
                    
                    if (cleanRoute === undefined ) {
                        
                        cleanRoute = parsedFragment;
                        
                    }
               
                    this.cleanRoute = rootlang.routes[cleanRoute];
                    
                }    else {
                    
                    this.cleanRoute = '';
                    
                } 
                
                
                logger.log("fragment:"+Backbone.history.fragment,3);  
                logger.log("config.i18n.selected:"+this.selected,3);  
                logger.log("config.routes.cleanRoute:"+this.cleanRoute,3);  
                logger.log(this.parsedURLRouteNetwork,3);  
                
                return this.cleanRoute;
                
            }
            
    
        }
    
    });