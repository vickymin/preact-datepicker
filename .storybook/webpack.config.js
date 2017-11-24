const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader',
				options: {
					limit: '25000',
					name: 'images/[name].[ext]',
				},
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			},
			{
				test: /\.less$/,
				include: /src/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader?-minimize', 'postcss-loader', 'less-loader'],
				}),
			},
		],
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true,
		}),
	],
	resolve: {
		alias: {
			react: 'preact-compat',
			'react-dom': 'preact-compat',
		},
	},
};
