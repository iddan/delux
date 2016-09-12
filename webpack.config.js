const path = require('path');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            },
        ]
    },
    resolve: {
        root: [
            path.resolve('./')
        ]
    },
    entry: {
        'lib/index.js': './src/index.js',
    },
    output: {
        path: '.',
        filename: '[name]',
        library: 'delux',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
};
