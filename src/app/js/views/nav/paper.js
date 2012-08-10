define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/nav/button.jade',
    'Raphael',
    'jade',
    'Mustache',
    'Logger',
    'config'
    ], function($, _, Backbone, mainHomeTemplate, Raphael,
    jade,Mustache,logger,config){

        var Paper = Backbone.View.extend({
       
            logcode : 'Paper',
            
            config : {},
            
            initialize : function() {
              
                // New objects are created from the prototype.
                
                this.config = {

                    paper : {
                        
                        id : 'temporary_id',
                        el : false,// DOM element or its ID which is going to be a parent for drawing surface
                        width: 150,// width
                        height: 150,// height
                        callback : function(){}// callback
                        
                    },

                }
                              
            },
                        
            /**
             * ************************************
             * Create Paper
             * ************************************
             */   
            createPaper : function(config){
    
                // Extend Config Object
                $.extend(this.config, config);
                
                this.createPaperParentEl();
                
                // Create the paper and assign to a created div el
                this.paper = Raphael(
                        this.config.paper.el,
                        this.config.paper.width, 
                        this.config.paper.height
                );
                
                return this.paper;

            },
                        
            /**
             * ************************************
             * Create button container
             * ************************************
             */
            createPaperParentEl : function() {              

                this.config.paper.el = document.createElement('div');

                this.setPaperElID();

                this.setPaperElClass();

            },
            
            /**
             * ************************************
             * Set Paper El ID
             * ************************************
             */            
            setPaperElID : function(){

                $(this.config.paper.el).attr('id',config.paper.el.suffix + '__' + this.config.paper.id);
   
            },
            
            /**
             * ************************************
             * Set Paper El class
             * ************************************
             */            
            setPaperElClass : function(){
                 
                $(this.config.paper.el).attr('class',config.paper.el.classname);
   
            }
            
        });
  
        return Paper;
  
    });
