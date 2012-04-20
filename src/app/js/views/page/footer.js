define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/footer.jade',
    'libs/pliik/pliik.config'
    ], function($, _, Backbone, pageFooterTemplate,pliikConfig){

        var pageFooterView = Backbone.View.extend({

            el: $('#footer'),
            
            template: jade.render(pageFooterTemplate),
            
            render: function(){

                var view = {
                    company : pliikConfig.entity,
                    date : $.format.date(Date(),pliikConfig.date.format)
                };
   
                   
                $('#footer').html(
                    Mustache.to_html(this.template, view)
                    );


            }
        });
  
        return new pageFooterView;
  
    });