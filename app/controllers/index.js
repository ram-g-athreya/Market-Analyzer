
/*
 * GET home page.
 */
exports.index = function(req, res) {
    res.render('index', {title: 'Home'});
};

exports.stock = function(req, res) {
    var id = req.params.id;
    var query = {};
    if (id == parseInt(id)) {
        query = {"SC_CODE": id};
    }
    else {
        var regexp;
        regexp = id + ".*";
        query = {"SC_NAME": new RegExp(regexp, 'i')};
    }
    app.db.stock.getStockData(query, function(err, data) {
        res.render('stock', {data: data});
    });
};
