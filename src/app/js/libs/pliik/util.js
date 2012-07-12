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
            
            isset : function() {
            // !No description available for isset. @php.js developers: Please update the function summary text file.
            // 
            // version: 1109.2015
            // discuss at: http://phpjs.org/functions/isset    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   improved by: FremyCompany
            // +   improved by: Onno Marsman
            // +   improved by: Rafał Kukawski
            // *     example 1: isset( undefined, true);    // *     returns 1: false
            // *     example 2: isset( 'Kevin van Zonneveld' );
            // *     returns 2: true
            var a = arguments,
                l = a.length,        i = 0,
                undef;

            if (l === 0) {
                throw new Error('Empty isset');    }

            while (i !== l) {
                if (a[i] === undef || a[i] === null) {
                    return false;        }
                i++;
            }
            return true;
            },

            
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
                
                
                
                /*
                //logger.log(rootlang,412);
                
                
                logger.log("fragment:"+Backbone.history.fragment,3);  
                logger.log("config.i18n.selected:"+this.selected,3);  
                logger.log("config.routes.cleanRoute:"+this.cleanRoute,3);  
                logger.log(this.parsedURLRouteNetwork,3);  
                */
               
                return this.cleanRoute;
                
            }
            
    
        }
    
    });