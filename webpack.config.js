const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        client: './src/client/ts/client.tsx'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: "[name].js"
    }
};