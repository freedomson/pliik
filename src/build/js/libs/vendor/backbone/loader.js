define([
    'order!libs/vendor/jquery/jquery-1.7.2.min',   
    'order!libs/vendor/underscore/underscore-min', 
    'order!libs/vendor/backbone/backbone-min'
],
function($,_,Backbone){
  return {
    Backbone: Backbone,
    _: _,
    $ : $
  };
});
