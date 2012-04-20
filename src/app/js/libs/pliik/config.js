//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
    //Do setup work here

    return {
        entity : 'Pliik',
        date: {
            format: {
                year : 'yyyy'                
            }
        }
    }
});