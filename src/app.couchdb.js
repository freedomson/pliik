var couchapp = require('couchapp'), 
path = require('path');

ddoc = 
{
    _id:'_design/p3', 
    rewrites : [ {
        from:"", 
        to:"index.html"
    },{
        from:"*", 
        to:"*"
    }]
};



couchapp.loadAttachments(ddoc, path.join(__dirname, 'app'));

module.exports = ddoc;
