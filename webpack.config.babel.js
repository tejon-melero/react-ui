import { resolve } from 'path'

export default {
    entry: resolve(__dirname, 'src', 'index.js'),
    output: {
        path: resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'reactUI',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: resolve(__dirname, 'src'),
                loader: 'babel',
                query: {
                    presets: [ 'es2015', 'react', 'stage-0' ],
                },
            },
        ],
    },
}
