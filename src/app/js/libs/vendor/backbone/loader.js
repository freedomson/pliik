define([
    'order!libs/vendor/jquery/jquery-min', 
    'order!libs/vendor/jquery/jquery.dateFormat-1.0',     
    'order!libs/vendor/underscore/underscore-min', 
    'order!libs/vendor/backbone/backbone-min'
],
function(){
  return {
    Backbone: Backbone.noConflict(),
    _: _.noConflict(),
    $: jQuery.noConflict()
  };
});
