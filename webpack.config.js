require('ts-node').register();

const webpack = require('webpack');

var path = require('path');
var join = path.join.bind(path, __dirname);

const tsImportPluginFactory = require('ts-import-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HappyPack = require('happypack');


// let { compileAPITypes, compileAPICodeTemplates } = require('../pre-build');


module.exports = {
	mode: 'development',
	entry: {
		demo: './src/index.tsx'
	},
	output: {
		path: join('public'),
		filename: '[name].js',
		library: '[name]'
	},
	module: {
		// in loaders you set the plugins to use when loading specific file extensions
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				include: [/src/],
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					getCustomTransformers: () => ({
						before: [tsImportPluginFactory([
							{
								style: true,
								libraryName: 'antd',
								libraryDirectory: 'lib',
							},
							{
								style: false,
								libraryName: 'lodash',
								libraryDirectory: null,
								camel2DashComponentName: false
							},
							{
								style: false,
								libraryDirectory: '../_esm2015/operators',
								libraryName: 'rxjs/operators',
								camel2DashComponentName: false,
								transformToDefaultImport: false
							}
						])]
					}),
					compilerOptions: {
						module: 'es2015'
					}
				},
			},
			// {
			// 	test: /\.tsx?$/,
			// 	loader: 'tslint-loader',
			// 	enforce: 'pre'
			// },
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{ loader: 'css-loader' },
					{ loader: 'less-loader', options: { sourceMap: true } }
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{ loader: 'css-loader' },
					'sass-loader'
				]
			}
		]
	},
	// in here we specify the configuration for when we require or import specific modules
	resolve: {
		// we accept any file that is either as-is, using a .js or .json extension
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		// these directories are the roots in which we scan for files given
		modules: [
			"node_modules",
			"src",
			"lib",
			"config"
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	devtool: 'source-map',
	devServer: {
		contentBase: './public',
		historyApiFallback: true,
		inline: true,
		port: 5000,
		hot: true,
		stats: {
			modules: false
		}
	}
};
