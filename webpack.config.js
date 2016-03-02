var path = require('path'),
    webpack = require('webpack'),
    fs = require('fs'),
    BowerWebpackPlugin = require("bower-webpack-plugin"),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    entry: {
        "interface": "./app.js"
    },
    context: __dirname + "/app",
    output: {
        path: __dirname + '/app/assets/js',
        filename: "[name].js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.png$/, loader: "url-loader?limit=100000"}
        ]
    },
    resolve: {
        root: [path.join(__dirname, "app/bower_components")]
    },
    plugins: [
        new BowerWebpackPlugin({
            modulesDirectories: ["app/bower_components"]
        }),
        new ngAnnotatePlugin({add: true}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: true,
            minimize: true
        }),
        new webpack.optimize.CommonsChunkPlugin("interface", "app.js")
    ]
};
