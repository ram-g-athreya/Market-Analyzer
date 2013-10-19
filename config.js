
var config = {
    dev: {
        mode: 'development',
        port: 80
    },
    production: {
        mode: 'production',
        port: 80
    }
};
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
}