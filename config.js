
var config = {
    dev: {
        mode: 'development',
        port: process.env.PORT
    },
    production: {
        mode: 'production',
        port: process.env.PORT
    }
};
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
};