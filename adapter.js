
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var adapter = function(host, port, db, callback) {
    var me = this;
    this.db = new Db(db, new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
    this.db.open(function() {
        //Setting models
        me.db.stock = require('./app/models/stock').stock(me.db);
        me.db.scrip = require('./app/models/scrip').scrip(me.db);
        
        app.db = me.db;
        callback();
    });
};

exports.adapter = adapter;