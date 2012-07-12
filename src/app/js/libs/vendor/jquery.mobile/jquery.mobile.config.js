define(["jQuery"],function($){
    
    /*
     * 
     * jquerymobile configuration file
     * 
     */
    $(document).bind("mobileinit", function(){

    alert("do ");
    
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;        
/*
        jQuery('div[data-role="page"]').live('pagehide', function (event, ui) {
            jQuery(event.currentTarget).remove();
        });   
  */  
        return;
  
    });

});


