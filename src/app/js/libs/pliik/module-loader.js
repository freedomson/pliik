//my/shirt.js now does setup work
//before returning its module definition.
define([
    'jQuery',
    'Underscore',    
    'config',
    'libs/pliik/utils'
],
function($,_,config) {

    var configurators = [];
    var routers = [];    

    $.each(config.modules.active, function(index, value) { 

        
        configurators.push('modules/' + value + '/config');
        routers.push('modules/' + value + '/router');        
        
        /*
        require([
              'modules/' + value + '/config'   
            ], function(config){

                modules[(config.order+'').lpad("0",5)+'_'+config.id.toUpperCase() ] = config;
    
            });*/

    });
    
    
    return {
        
        configurators : configurators,
        routers : routers,
        loadPaths: _.union(configurators,routers)
        
    }
                
    
});