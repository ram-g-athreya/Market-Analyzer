
var stock = function(db) {
    return require('./base').base(db, stock, 'stock');
};

stock.getStockData = function(query, callback) {
    this.find(query, {OPEN: 1, CLOSE: 1, DATETIME: 1, _id: 0}).toArray(function(err, data) {
        var days;
        var close = getColumnValues(data, 'CLOSE'), daily_return;
        var last_index = data.length - 1;

        //Initializing Day 1 of sample data
        data[last_index]['DAILY_RETURN'] = 0;

        data[last_index]['SHARPE_RATIO_WEEK'] = 0;
        data[last_index]['SHARPE_RATIO_MONTH'] = 0;
        data[last_index]['SHARPE_RATIO_QUARTER'] = 0;
        data[last_index]['SHARPE_RATIO_YEAR'] = 0;
        //data[last_index]["ACTION"] = "";

        for (var index = last_index - 1; index >= 0; index--) {
            data[index]['DAILY_RETURN'] = close[index] / close[index + 1] - 1;
            days = last_index - index;

            daily_return = getColumnValues(data.slice(-days - 1), 'DAILY_RETURN');

            function getRatio(days, data) {
                data = data.slice(0, days + 1);
                var avg = average(data);
                var deviation = stdev(data, avg);
                return sharpeRatio(Math.min(days, data.length - 1), avg, deviation);
            }

            data[index]['SHARPE_RATIO_WEEK'] = getRatio(5, daily_return);
            data[index]['SHARPE_RATIO_MONTH'] = getRatio(20, daily_return);
            data[index]['SHARPE_RATIO_QUARTER'] = getRatio(80, daily_return);
            data[index]['SHARPE_RATIO_YEAR'] = getRatio(250, daily_return);

            if (data[index]['DAILY_RETURN'] < 0 && data[index]['SHARPE_RATIO_WEEK'] > 0 && data[index]['SHARPE_RATIO_MONTH'] > 0) {
                data[index]['ACTION'] = "BUY";
            }
            else {
                data[index]["ACTION"] = "";
            }
            
            if(data[index]["DAILY_RETURN"]>=0.01){
                //data[index]["ACTION"]="EVENT";
            }

        }
        callback(err, data);
    });
};

exports.stock = stock;