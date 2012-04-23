//my/shirt.js now does setup work
//before returning its module definition.
define([
    'jQuery',
    'config',
    'libs/pliik/utils'
],
function($,config) {

    var modules = [];

    $.each(config.modules.active, function(index, value) { 

        
        modules.push('modules/' + value + '/config');
        
        /*
        require([
              'modules/' + value + '/config'   
            ], function(config){

                modules[(config.order+'').lpad("0",5)+'_'+config.id.toUpperCase() ] = config;
    
            });*/

    });
    
    
    return {
        
        list : modules
        
    }
                
    
});