var request = require("request");
var fs = require("fs");
var unzip = require("unzip");
var csv = require("csv");
var sys = require("sys");
var exec = require('child_process').exec;

var base_url = "http://www.bseindia.com/download/BhavCopy/Equity";
var url_suffix = "_csv.zip";
var file;

function finish() {
    //Finding extracted CSV file
    var files = [file, __dirname + '/tmp.zip'];
    var length = files.length;
    files.forEach(function(filepath) {
        fs.unlink(filepath, function(err) {
            length--;
            if (err) {
                //File does not exist
                return;
            } else if (length <= 0) {
                processor();
            }
        });
    });
}

function readCSV() {
    var data = Array(), args;
    csv().from.path(file, {delimiter: ',', escape: '"'}).on('record', function(row, index) {
        data.push(row);
    }).on('end', function(count) {
        var object, datestring = processor.getDateString();
        args = data[0];
        data = data.slice(1);

        for (var row in data) {
            object = {};
            for (var column in args) {
                object[args[column]] = data[row][column];
            }
            object['DATETIME'] = datestring.year + datestring.month + datestring.day;
            app.db.stock.insert(object);
        }
        console.log("Insertion complete " + data.length + " records added for date " + processor.getDate());
        finish();
    });
}


function extract() {
    fs.createReadStream(__dirname + '/tmp.zip')
            .pipe(unzip.Extract({path: __dirname}))
            .on('error', function() {
        console.log('Error not a trading day ' + base_url + file + url_suffix);
        finish();
    })
            .on('finish', function() {
        //Using set timeout since finish gets called before extraction is completed
        setTimeout(function() {
            exec("find " + __dirname + " -name '*.csv' -o -name '*.CSV'", function(error, stdout, stderr) {
                console.log('Extraction Complete');
                file = stdout.replace('\n', '');
                readCSV();
            });
        }, 500);
    });
}

function downloadFile(file) {
    request(file)
            .pipe(fs.createWriteStream(__dirname + '/tmp.zip'))
            .on('finish', function() {
        console.log('Zip File Downloaded');
        extract();
    });
}

var processor = function() {
    if (typeof process.argv[4] !== 'undefined') {
        processor.limit = process.argv[4];
    }
    else {
        processor.limit = 1;
    }
    processor.count++;
    if (processor.count <= processor.limit) {
        processor.setDate();
        var datestring = processor.getDateString()

        file = "/eq" + datestring.day + datestring.month + datestring.year;
        downloadFile(base_url + file + url_suffix);
    }
    else {
        process.exit(1);
    }
};

processor.count = 0;
processor.getDateString = function() {
    return processor.datestring;
};
processor.setDateString = function() {
    var date = processor.getDate();
    var year = date.getYear() % 100;
    var month = date.getMonth() + 1;
    var day = date.getDate();

    function convertToString(date) {
        return ((date < 10) ? "0" + date : date).toString();
    }
    processor.datestring = {
        day: convertToString(day),
        month: convertToString(month),
        year: convertToString(year)
    };
};
processor.getDate = function() {
    return processor.date;
};
processor.setDate = function() {
    var date = new Date();
    date.setDate(date.getDate() - processor.count);
    processor.date = date;
    processor.setDateString();
};


//Write zip file to filesystem
exports.start = function() {
    processor();
};