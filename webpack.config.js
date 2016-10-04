module.exports = {
    entry: './src/index.js',
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: /src/,
                loader: 'babel'
            },
        ]
    },
    output: {
        path: 'bin',
        filename: 'index.js',
        library: 'delux',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
};
