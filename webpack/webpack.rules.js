module.exports = [
	{
		test: /\.js$/,
		exclude: /(node_modules)/,
		loaders: ['react-hot-loader/webpack', 'babel-loader?presets[]=es2015,presets[]=stage-2,presets[]=react']
	},
	{
		test: /\.s?css$/,
		loaders: ['style-loader', 'css-loader', 'sass-loader']
	},
	{
		test: /\.(png|jpe?g|gif|svg|ttf|woff2?)$/,
		loader: 'url-loader?limit=8192'
	}
];