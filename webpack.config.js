const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const config = {
	entry: {
		'preact-datepicker': './src/index.js',
	},

	/**
	 * Library target is set to umd so the anwb core js loading system can import it
	 */
	output: {
		path: path.resolve(__dirname, `./dist`),
		filename: 'index.js',
		chunkFilename: '[name]-chunk.js',
		library: '[name]',
		libraryTarget: 'umd',
	},

	resolve: {
		/**
		 * Import files from the components, utils or node_modules directory
		 */
		modules: ['node_modules'],
	},

	externals: {
		/**
		 * Preact is not included in the build
		 */
		preact: {
			root: 'Preact',
			commonjs2: 'preact',
			commonjs: 'preact',
			amd: 'preact',
		},
	},

	module: {
		rules: [
			/**
			 * Svg images are loaded and placed in the images directory
			 */
			{
				test: /\.svg$/,
				loader: 'file-loader',
				options: {
					name: 'images/[name].[ext]',
				},
			},

			/**
			 * All images bigger then 25000 bytes are placed in an images folder. Small images are included as inline base 64.
			 */
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader',
				options: {
					limit: '25000',
					name: 'images/[name].[ext]',
				},
			},

			/**
			 * All less files are converted down to css and are autoprefixed using the postcss module
			 */
			{
				test: /\.less$/,
				include: /src/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader?-minimize', 'postcss-loader', 'less-loader'],
				}),
			},

			/**
			 * Css is included as is since it's third party vendor css
			 */
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			},

			/**
			 * Js is transpiled using babel
			 */
			{
				test: /\.js?$/,
				include: /src/,
				loader: 'babel-loader',
			},
		],
	},

	/**
	 * Bail when an error is encountered
	 */
	bail: true,

	/**
	 * Which kind of source maps to build and include
	 */
	devtool: 'source-map',

	plugins: [
		/**
		 * The extract text plugin makes sure that all css is put into a single css file named after the application
		 */
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true,
		}),

		/**
		 * The define plugin makes it possible to consume a PRODUCTION constant in our javascript files to check for production builds
		 */
		production &&
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production'),
				},
			}),

		/**
		 * Enable scope hoisting webpack 3
		 */
		new webpack.optimize.ModuleConcatenationPlugin(),

		/**
		 * Minify all code
		 */
		production &&
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false,
			}),

		/**
		 * Minify all code using uglify but keep sourcemaps
		 */
		production &&
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
			}),
	].filter(Boolean),
};

module.exports = config;
