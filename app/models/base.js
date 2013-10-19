
exports.base = function(db, collection, name) {
    var _collection = collection;
    collection = db.collection(name);
    for (var attr in _collection) {
        collection[attr] = _collection[attr];
    }
    return collection;
};