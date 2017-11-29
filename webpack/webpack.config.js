const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SETTINGS = {
	DEVTOOL: process.env.WEBPACK_DEVTOOL || 'source-map',
	SRCDIR: path.join(__dirname, '..', 'client'),
	OUTDIR: path.join(__dirname, '..', 'build'),
};

module.exports = {
	entry: [
		'webpack/hot/dev-server',
		'webpack-hot-middleware/client',
		path.join(SETTINGS.SRCDIR, 'bundle.js'),
	],
	devtool: SETTINGS.DEVTOOL,
	output: {
		path: SETTINGS.OUTDIR,
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules,
	},
	devServer: {
		contentBase: SETTINGS.OUTDIR,
		noInfo: true,
		hot: true,
		inline: true,
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		// new CopyWebpackPlugin([{
		// 	from: path.join(SETTINGS.SRCDIR, 'index.html')
		// }]),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
	},
};