const resolve = require('path').resolve;
const webpack = require('webpack');

const CONFIG = {
    entry: {
        app: resolve('./index.js')
    },

    devtool: 'source-map',

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'buble-loader',
            include: [resolve('.')],
            exclude: [/node_modules/],
            options: {
                objectAssign: 'Object.assign'
            }
        }]
    },

    resolve: {
        alias: {
            'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
        }
    },

    output: {
        path: resolve('./app/public'),
        filename: 'bundle.js'
    },

    // Optional: Enables reading mapbox token from environment variable
    plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])]
};

module.exports = env => (env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG);