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

        var Button = Backbone.View.extend({

            counter : 0,
            
            logcode: 'Button',
            
            offsety : 10,
            
            config : {},
            
            buttonSet : {},
            
            initialize : function() {
              
                // New objects are created from the prototype.
                this.buttonSet = {};

                
                this.config = {
                    
                    circle : {
                        
                        x : '50', // x coordinate of the centre                
                        y : '50',// y coordinate of the centre
                        radius: '40' // radius
                        
                    },

                    color : {

                        active : 'yellowgreen',
                        selected : 'orange',
                        glow : 'black'

                    },

                    iconsetup : {

                        glow : 'white',
                        color : 'black',
                        centerX : 0,
                        centerY: 0

                    }

                }
                              
            },
                     

            /**
             * ************************************
             * Render container
             * ************************************
             */
            render: function(config){                              

                // Extend Config Object
                $.extend(true, this.config, config);
                
                this.paper = this.config.paper;
                
                this.buttonSet = this.paper.set(
                    this.drawButtonCircle()
                );

                logger.log('PLIIK.log[6001][3].transform("t100,100r45t-100,0");',this.logcode);
                // logger.log(this.icon,this.logcode);
                logger.log(this.circle,this.logcode);
                
                this.bind();
                
                return this.buttonSet;

            },
                        
            
            /**
             * ************************************
             * Draw Button Circle
             * ************************************
             */  
            drawButtonCircle : function(){
                  

               this.circle = this.paper.circle(
                    this.config.circle.x, // x coordinate of the centre
                    this.config.circle.y, // y coordinate of the centre
                    this.config.circle.radius // radius
                    ).animate({
                        fill: this.config.color.active, 
                        // stroke: "#444", 
                        // "stroke-width": 20, 
                        // "stroke-opacity": 0.8,
                        // offsetx:0,
                        // offsety: this.offsety
                    }, 
                    1000,function(){
/*
                        this.glow({
                            color: that.config.color.glow,
                            offsetx:0,
                            offsety:that.offsety
                        });
*/
                    });
                    
                return this.circle;
                    
            },

            /**
             * ************************************
             * Draw Button Icon
             * ************************************
             */  
            drawButtonIcon : function(){
                
                this.icon = this.paper.path(
                // People 'M21.066,20.667c1.227-0.682,1.068-3.311-0.354-5.874c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.102,1.031c-1.164,0-2.231-0.391-3.104-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.578,5.192-0.35,5.874c0.549,0.312,1.127,0.078,1.723-0.496c-0.105,0.582-0.166,1.213-0.166,1.873c0,2.938,1.139,5.312,2.543,5.312c0.846,0,1.265-0.865,1.466-2.188c0.2,1.314,0.62,2.188,1.461,2.188c1.396,0,2.545-2.375,2.545-5.312c0-0.66-0.062-1.291-0.168-1.873C19.939,20.745,20.516,20.983,21.066,20.667zM15.5,12.201c2.361,0,4.277-1.916,4.277-4.279S17.861,3.644,15.5,3.644c-2.363,0-4.28,1.916-4.28,4.279S13.137,12.201,15.5,12.201zM24.094,14.914c1.938,0,3.512-1.573,3.512-3.513c0-1.939-1.573-3.513-3.512-3.513c-1.94,0-3.513,1.573-3.513,3.513C20.581,13.341,22.153,14.914,24.094,14.914zM28.374,17.043c-0.502-0.907-1.116-1.641-1.732-2.154c-0.718,0.526-1.594,0.846-2.546,0.846c-0.756,0-1.459-0.207-2.076-0.55c0.496,1.093,0.803,2.2,0.861,3.19c0.093,1.516-0.381,2.641-1.329,3.165c-0.204,0.117-0.426,0.183-0.653,0.224c-0.056,0.392-0.095,0.801-0.095,1.231c0,2.412,0.935,4.361,2.088,4.361c0.694,0,1.039-0.71,1.204-1.796c0.163,1.079,0.508,1.796,1.199,1.796c1.146,0,2.09-1.95,2.09-4.361c0-0.542-0.052-1.06-0.139-1.538c0.492,0.472,0.966,0.667,1.418,0.407C29.671,21.305,29.541,19.146,28.374,17.043zM6.906,14.914c1.939,0,3.512-1.573,3.512-3.513c0-1.939-1.573-3.513-3.512-3.513c-1.94,0-3.514,1.573-3.514,3.513C3.392,13.341,4.966,14.914,6.906,14.914zM9.441,21.536c-1.593-0.885-1.739-3.524-0.457-6.354c-0.619,0.346-1.322,0.553-2.078,0.553c-0.956,0-1.832-0.321-2.549-0.846c-0.616,0.513-1.229,1.247-1.733,2.154c-1.167,2.104-1.295,4.262-0.287,4.821c0.451,0.257,0.925,0.064,1.414-0.407c-0.086,0.479-0.136,0.996-0.136,1.538c0,2.412,0.935,4.361,2.088,4.361c0.694,0,1.039-0.71,1.204-1.796c0.165,1.079,0.509,1.796,1.201,1.796c1.146,0,2.089-1.95,2.089-4.361c0-0.432-0.04-0.841-0.097-1.233C9.874,21.721,9.651,21.656,9.441,21.536z'
                // IE 'M27.998,2.266c-2.12-1.91-6.925,0.382-9.575,1.93c-0.76-0.12-1.557-0.185-2.388-0.185c-3.349,0-6.052,0.985-8.106,2.843c-2.336,2.139-3.631,4.94-3.631,8.177c0,0.028,0.001,0.056,0.001,0.084c3.287-5.15,8.342-7.79,9.682-8.487c0.212-0.099,0.338,0.155,0.141,0.253c-0.015,0.042-0.015,0,0,0c-2.254,1.35-6.434,5.259-9.146,10.886l-0.003-0.007c-1.717,3.547-3.167,8.529-0.267,10.358c2.197,1.382,6.13-0.248,9.295-2.318c0.764,0.108,1.567,0.165,2.415,0.165c5.84,0,9.937-3.223,11.399-7.924l-8.022-0.014c-0.337,1.661-1.464,2.548-3.223,2.548c-2.21,0-3.729-1.211-3.828-4.012l15.228-0.014c0.028-0.578-0.042-0.985-0.042-1.436c0-5.251-3.143-9.355-8.255-10.663c2.081-1.294,5.974-3.209,7.848-1.681c1.407,1.14,0.633,3.533,0.295,4.518c-0.056,0.254,0.24,0.296,0.296,0.057C28.814,5.573,29.026,3.194,27.998,2.266zM13.272,25.676c-2.469,1.475-5.873,2.539-7.539,1.289c-1.243-0.935-0.696-3.468,0.398-5.938c0.664,0.992,1.495,1.886,2.473,2.63C9.926,24.651,11.479,25.324,13.272,25.676zM12.714,13.046c0.042-2.435,1.787-3.49,3.617-3.49c1.928,0,3.49,1.112,3.49,3.49H12.714z'
                /* Shop */ // 'M29.02,11.754L8.416,9.473L7.16,4.716C7.071,4.389,6.772,4.158,6.433,4.158H3.341C3.114,3.866,2.775,3.667,2.377,3.667c-0.686,0-1.242,0.556-1.242,1.242c0,0.686,0.556,1.242,1.242,1.242c0.399,0,0.738-0.201,0.965-0.493h2.512l5.23,19.8c-0.548,0.589-0.891,1.373-0.891,2.242c0,1.821,1.473,3.293,3.293,3.293c1.82,0,3.294-1.472,3.297-3.293c0-0.257-0.036-0.504-0.093-0.743h5.533c-0.056,0.239-0.092,0.486-0.092,0.743c0,1.821,1.475,3.293,3.295,3.293s3.295-1.472,3.295-3.293c0-1.82-1.473-3.295-3.295-3.297c-0.951,0.001-1.801,0.409-2.402,1.053h-7.136c-0.601-0.644-1.451-1.052-2.402-1.053c-0.379,0-0.738,0.078-1.077,0.196l-0.181-0.685H26.81c1.157-0.027,2.138-0.83,2.391-1.959l1.574-7.799c0.028-0.145,0.041-0.282,0.039-0.414C30.823,12.733,30.051,11.86,29.02,11.754zM25.428,27.994c-0.163,0-0.295-0.132-0.297-0.295c0.002-0.165,0.134-0.297,0.297-0.297s0.295,0.132,0.297,0.297C25.723,27.862,25.591,27.994,25.428,27.994zM27.208,20.499l0.948-0.948l-0.318,1.578L27.208,20.499zM12.755,11.463l1.036,1.036l-1.292,1.292l-1.292-1.292l1.087-1.087L12.755,11.463zM17.253,11.961l0.538,0.538l-1.292,1.292l-1.292-1.292l0.688-0.688L17.253,11.961zM9.631,14.075l0.868-0.868l1.292,1.292l-1.292,1.292l-0.564-0.564L9.631,14.075zM9.335,12.956l-0.328-1.24L9.792,12.5L9.335,12.956zM21.791,16.499l-1.292,1.292l-1.292-1.292l1.292-1.292L21.791,16.499zM21.207,14.5l1.292-1.292l1.292,1.292l-1.292,1.292L21.207,14.5zM18.5,15.791l-1.293-1.292l1.292-1.292l1.292,1.292L18.5,15.791zM17.791,16.499L16.5,17.791l-1.292-1.292l1.292-1.292L17.791,16.499zM14.499,15.791l-1.292-1.292l1.292-1.292l1.292,1.292L14.499,15.791zM13.791,16.499l-1.292,1.291l-1.292-1.291l1.292-1.292L13.791,16.499zM10.499,17.207l1.292,1.292l-0.785,0.784l-0.54-2.044L10.499,17.207zM11.302,20.404l1.197-1.197l1.292,1.292L12.5,21.791l-1.131-1.13L11.302,20.404zM13.208,18.499l1.291-1.292l1.292,1.292L14.5,19.791L13.208,18.499zM16.5,19.207l1.292,1.292L16.5,21.79l-1.292-1.291L16.5,19.207zM17.208,18.499l1.292-1.292l1.291,1.292L18.5,19.79L17.208,18.499zM20.499,19.207l1.292,1.292L20.5,21.79l-1.292-1.292L20.499,19.207zM21.207,18.499l1.292-1.292l1.292,1.292l-1.292,1.292L21.207,18.499zM23.207,16.499l1.292-1.292l1.292,1.292l-1.292,1.292L23.207,16.499zM25.207,14.499l1.292-1.292L27.79,14.5l-1.291,1.292L25.207,14.499zM24.499,13.792l-1.156-1.156l2.082,0.23L24.499,13.792zM21.791,12.5l-1.292,1.292L19.207,12.5l0.29-0.29l2.253,0.25L21.791,12.5zM14.5,11.791l-0.152-0.152l0.273,0.03L14.5,11.791zM10.5,11.792l-0.65-0.65l1.171,0.129L10.5,11.792zM14.5,21.207l1.205,1.205h-2.409L14.5,21.207zM18.499,21.207l1.206,1.206h-2.412L18.499,21.207zM22.499,21.207l1.208,1.207l-2.414-0.001L22.499,21.207zM23.207,20.499l1.292-1.292l1.292,1.292l-1.292,1.292L23.207,20.499zM25.207,18.499l1.292-1.291l1.291,1.291l-1.291,1.292L25.207,18.499zM28.499,17.791l-1.291-1.292l1.291-1.291l0.444,0.444l-0.429,2.124L28.499,17.791zM29.001,13.289l-0.502,0.502l-0.658-0.658l1.016,0.112C28.911,13.253,28.956,13.271,29.001,13.289zM13.487,27.994c-0.161,0-0.295-0.132-0.295-0.295c0-0.165,0.134-0.297,0.295-0.297c0.163,0,0.296,0.132,0.296,0.297C13.783,27.862,13.651,27.994,13.487,27.994zM26.81,22.414h-1.517l1.207-1.207l0.93,0.93C27.243,22.306,27.007,22.428,26.81,22.414z'
                // Plus 'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z'
                'M16.015,12.03c-2.156,0-3.903,1.747-3.903,3.903c0,2.155,1.747,3.903,3.903,3.903c0.494,0,0.962-0.102,1.397-0.27l0.836,1.285l1.359-0.885l-0.831-1.276c0.705-0.706,1.142-1.681,1.142-2.757C19.918,13.777,18.171,12.03,16.015,12.03zM16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM26.174,20.809c-0.241,0.504-0.513,0.99-0.826,1.45L22.19,21.58c-0.481,0.526-1.029,0.994-1.634,1.385l0.119,3.202c-0.507,0.23-1.028,0.421-1.569,0.57l-1.955-2.514c-0.372,0.051-0.75,0.086-1.136,0.086c-0.356,0-0.706-0.029-1.051-0.074l-1.945,2.5c-0.541-0.151-1.065-0.342-1.57-0.569l0.117-3.146c-0.634-0.398-1.208-0.88-1.712-1.427L6.78,22.251c-0.313-0.456-0.583-0.944-0.826-1.448l2.088-2.309c-0.226-0.703-0.354-1.451-0.385-2.223l-2.768-1.464c0.055-0.563,0.165-1.107,0.301-1.643l3.084-0.427c0.29-0.702,0.675-1.352,1.135-1.942L8.227,7.894c0.399-0.389,0.83-0.744,1.283-1.07l2.663,1.672c0.65-0.337,1.349-0.593,2.085-0.75l0.968-3.001c0.278-0.021,0.555-0.042,0.837-0.042c0.282,0,0.56,0.022,0.837,0.042l0.976,3.028c0.72,0.163,1.401,0.416,2.036,0.75l2.704-1.697c0.455,0.326,0.887,0.681,1.285,1.07l-1.216,2.986c0.428,0.564,0.793,1.181,1.068,1.845l3.185,0.441c0.135,0.535,0.247,1.081,0.302,1.643l-2.867,1.516c-0.034,0.726-0.15,1.43-0.355,2.1L26.174,20.809z'
                ).attr({
                    fill: this.config.iconsetup.color, 
                    stroke: "none"
                });

                var iconBox = this.icon.getBBox();
                
                this.config.iconsetup.centerX = this.config.circle.x-iconBox.width/2;
                
                this.config.iconsetup.centerY = this.config.circle.y-iconBox.height/2                

                this.icon.transform( "t" + this.config.iconsetup.centerX + ","+ this.config.iconsetup.centerY);
                
                // this.iconglow = this.icon.glow({color:this.config.iconsetup.glow});
                
                this.icon.hide();
                
                return this.icon;
                
            },
            

            /**
             * ************************************
             * Press Button
             * ************************************
             */            
            pressButton : function(){
                
                // this.circle.transform("t0,0rt-0,"+this.offsety);
                
                this.circle.animate({fill: this.config.color.selected},250);

                // this.icon.transform( "t" + this.config.iconsetup.centerX + ","+ this.config.iconsetup.centerY+"t-0,"+this.offsety);        
                
                // this.iconglow.transform("t0,0r0t-0,"+this.offsety);
                
            },
            
            
            /**
             * ************************************
             * Release Button
             * ************************************
             */             
            releaseButton : function(){
                
                // this.circle.transform("t0,0rt-0,0");
                
                // this.icon.transform( "t" + this.config.iconsetup.centerX + ","+ this.config.iconsetup.centerY);        
                
                // this.iconglow.transform("t0,0r0t-0,0");
                
                this.circle.animate({fill: this.config.color.active},250);                
  
            },            
            
            
            /**
             * ************************************
             * Bind Button
             * ************************************
             */             
            bind : function(){
                
                logger.log('Binding',this.logcode);
                // logger.log($( this.parentEl ),this.logcode);

                var that = this;

                 this.buttonSet.mousedown(
                      function(){
                       that.pressButton();
                      }
                  );

                 this.buttonSet.mouseup(
                      function(){
                       that.releaseButton();
                      }
                  );                    

            }
            
        });
   
        return Button;
  
    });
