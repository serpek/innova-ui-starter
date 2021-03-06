const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require("./webpack.config");

//GLOBAL
let global = {
    name: "global",
    entry: ["jszip/dist/jszip"],
    output: {
        path: path.join(__dirname, config.outputPath),
        publicPath: '/',
        filename: "js/global.js"
    },
    plugins: []
};

// VENDOR
let vendor = {
    name: "vendor",
    entry: [
        "angular",
        "jquery",
        "oclazyload",
        "bootstrap",
        "@uirouter/angularjs",
        '@uirouter/angularjs/lib/legacy/stateEvents.js',
        'angular-sanitize',
        'angular-block-ui',
        'angular-animate',
        'angular-touch',
        'angular-ui-bootstrap'
    ],
    output: {
        path: path.join(__dirname, config.outputPath),
        publicPath: '/',
        filename: "js/vendor.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};

// PLUGINS
let plugins = {
    name: "plugins",
    entry: [
        "jszip",
        "devextreme/dist/js/dx.all", "fusioncharts",
        path.join(__dirname, '/libs/fusioncharts/angular-fusioncharts.min.js'),
        path.join(__dirname, '/libs/angular-mega-menu.js')
    ],
    output: {
        path: path.join(__dirname, config.outputPath),
        publicPath: '/',
        filename: "js/plugins.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
};

// APP
let app = {
    name: "app",
    module: config.module,
    resolve: config.resolve,
    entry: ['babel-polyfill', path.join(__dirname, 'client/app/app.js')],
    output: {
        path: path.join(__dirname, config.outputPath),
        publicPath: '/',
        filename: "js/app.js"
    },
    devtool: "source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin("css/[name].min.css", { allChunks: true })
    ]
};

module.exports = [global, vendor, plugins, app];