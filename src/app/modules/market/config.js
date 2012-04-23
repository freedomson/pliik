//my/shirt.js now does setup work
//before returning its module definition.

define(
["i18n!modules/market/nls/market"],
function (lang) {
    //Do setup work here

    return {
        
        id : 'market',
        order : 1,

        menu : [
        {
            title : lang.market,
            route : "/market"
        }           
        ]
        
    }
    
});