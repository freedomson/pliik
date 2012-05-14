define(['underscore', 'backbone'], 
    function(_, Backbone) {
    
        var UserModel = Backbone.Model.extend({

            // Default attributes for the todo.
            defaults: {
                username: ''
            },


            initialize: function() {

            },

            validate: function() {
                if (this.get("username") == '' ) {
                    return "Please enter a username!";
                }
            }

        });
    
        return UserModel;
    
    });