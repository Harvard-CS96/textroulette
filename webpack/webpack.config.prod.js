const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SETTINGS = {
	SRCDIR: path.join(__dirname, '..', 'client'),
	OUTDIR: path.join(__dirname, '..', 'build'),
};

module.exports = {
	entry: [
		path.join(SETTINGS.SRCDIR, 'bundle.js'),
	],
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
	plugins: [
		// new CopyWebpackPlugin([{
		// 	from: path.join(SETTINGS.SRCDIR, 'index.html'),
		// }]),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({
				NODE_ENV: 'production',
			}),
		}),
		new webpack.optimize.ModuleConcatenationPlugin()
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		dns: 'empty',
	},
};