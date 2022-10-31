const baseOptions = require('virmator/base-configs/base-nyc.js');

const nycConfig = {
    ...baseOptions,
    exclude: [
        baseOptions.exclude,
        'src/readme-examples/',
    ],
};

module.exports = nycConfig;
