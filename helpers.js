
average = function(array) {
    var sum = 0;
    for (var index in array) {
        sum += parseFloat(array[index]);
    }
    return sum / array.length;
};

variance = function(array, mean) {
    var result = 0;
    for (var index in array) {
        result += Math.pow(array[index] - mean, 2);
    }
    return result / (array.length - 1);
};

stdev = function(array, mean) {
    return Math.sqrt(variance(array, mean));
};

sharpeRatio = function(days, mean, st_dev) {
    return Math.sqrt(days) * mean / st_dev;
};

getColumnValues = function(array, column) {
    var result = Array();
    for (var row in array) {
        result.push(parseFloat(array[row][column]));
    }
    return result;
};

