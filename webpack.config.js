const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: {
        content_scripts__client: path.join(__dirname, 'src', 'client.ts'),
        content_scripts__timers_assassin: path.join(__dirname, 'src', 'timers_assassin.ts'),
        popup: path.join(__dirname, 'src', 'popup.ts'),
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (pathData) => {
          return pathData.chunk.name.split('__').join('/') + '.js';
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: '/node_modules/',
            },
            {
                test: /\.html$/,
                use: 'html-loader',
                exclude: '/node_modules/',
            },
            {
                test: /\.css$/,
                use: 'style-loader',
                exclude: '/node_modules/',
            }
        ],
    },
    mode: 'development',
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
        ],
        extensions: [
            ".ts",
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'manifest.json'),
                    to: path.resolve(__dirname, 'dist', "manifest.json"),
                },
                {
                    from: path.resolve(__dirname, 'src', 'popup.html'),
                    to: path.resolve(__dirname, 'dist', "popup.html"),
                },
                {
                    from: path.resolve(__dirname, 'src', 'popup.css'),
                    to: path.resolve(__dirname, 'dist', "popup.css"),
                },
            ],
        }),
    ],
    stats: 'detailed',
};
