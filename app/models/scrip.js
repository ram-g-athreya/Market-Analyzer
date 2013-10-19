
var scrip = function(db) {
    return require('./base').base(db, scrip, 'scrip');
};

exports.scrip = scrip;