//my/shirt.js now does setup work
//before returning its module definition.

define(["i18n!modules/market/nls/i18n"],
function (lang) {
    //Do setup work here

    return {
        
        id : 'market',
        order : 1,

        menu : [
        {
            title : lang.module,
            route : lang.routes["/market"]
        }           
        ]
        
    }
    
});