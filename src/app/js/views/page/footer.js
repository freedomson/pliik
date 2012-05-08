define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/page/footer.jade',
    'config',
    'libs/pliik/util',
    'jade'
    ], function(
        $, 
        _, 
        Backbone, 
        pageFooterTemplate,
        Config,
        Util,
        jade){

        var pageFooterView = Backbone.View.extend({

            el: $('#footer-container'),
            
            template: jade.render(pageFooterTemplate),
            
            render: function(){
                
                var view = {
                    opensourcelink : Util.parseURL('/content/opensource'),
                    entity : Config.entity,
                    date : $.format.date(Date(),Config.date.format.year)
                };
   
                   
                $('#footer').html(
                    Mustache.to_html(this.template, view)
                    );


            }
        });
  
        return new pageFooterView;
  
    });