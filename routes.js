var index = require("./app/controllers/index");

exports.setRoutes = function() {
    app.get('/', index.index);
    app.get('/stock/:id', index.stock);
};