var express = require("express");

var p2p = require('./p2p.js');
var api_store = require('./api_store.js');

var mode = (process.env.MODE == undefined ? "AP" : process.env.MODE)
var port = (process.argv.length > 2) ? parseInt(process.argv[2], 10) : 3001

var app = express();
app.use(require('body-parser').json());
app.use(function(req, res, next) {
    res.setHeader('X-Sys-Id', port)
    next();
})

var engine = require('./' + mode + "/init.js");
engine.init(app, port);

api_store.init(engine)
app.get("/admin/dump", api_store.dump);
app.get("/admin/clean", function(request, response) {
    for (var i=0; i<25; i++)
        console.log("\n");
    response.status(200).end();
});

app.get("/database/:key", api_store.get);
app.post("/database/:key/:val", api_store.post);

p2p.init(port)
app.listen(port, function() {
    console.log("Service started on port ", port);

    if (port == 3004 || port == 3006) {
        require('./db.js').slowness(5000);
        console.log("...and I am slow!\n");
    } else {
        console.log("\n");
    }
});