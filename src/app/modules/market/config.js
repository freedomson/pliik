//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
    //Do setup work here

    return {
        
        id : 'market',
        order : 1,

        menu : [
            {
                title : "Market",
                route : "/market"
            }           
        ]
        
    }
    
});