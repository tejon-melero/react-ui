module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'react-ui.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-1', 'react']
                }
            }
        ]
    }
}
