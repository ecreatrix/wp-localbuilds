'use strict'; // eslint-disable-line

const webpack = require('webpack');
const path = require('path');
const { argv } = require('yargs');

const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CssnanoPlugin = require('cssnano-webpack-plugin');

const isProduction = !!( ( argv.env && argv.env.production ) || argv.p );

let source = 'source';
let dist = 'dist';

let webpackConfig = {
	mode: isProduction ? 'production' : 'development',
  	watch: argv.env && argv.env.watch ? true : false,
  	watchOptions: {
	    aggregateTimeout: 300,
	    poll: 1000, // How often check for changes (in milliseconds)
	},
	entry: {
		"main": [ path.resolve( `${ source }/scripts/main.jsx` ), path.resolve( `${ source }/styles/main.scss` ) ],
		"main.min": [ path.resolve( `${ source }/scripts/main.jsx` ) ],

		"admin": [ path.resolve( `${ source }/scripts/admin.jsx` ), path.resolve( `${ source }/styles/admin.scss` ) ],
		"admin.min": [ path.resolve( `${ source }/scripts/admin.jsx` ) ],

		"settings": [ path.resolve( `${ source }/settings/settings.jsx` ), path.resolve( `${ source }/settings/settings.scss` ) ],
		"settings.min": [ path.resolve( `${ source }/settings/settings.jsx` ) ],
	},
	output: {
		path: path.resolve( `${ dist }` ),
		filename: `assets/scripts/[name].js`
	},
	module: {
		rules: [ {
            test: /(\.jsx|\.esm.js)$/,
            exclude: /(disposables)/,
            loader: 'babel-loader',
            options: {
                presets: [ "@babel/react", "@babel/preset-env", "@emotion/babel-preset-css-prop" ],
                plugins: [
                    [ "@babel/plugin-proposal-object-rest-spread", { "useBuiltIns": true } ], 
                    [ "@babel/plugin-transform-react-jsx", { "pragma": "wp.element.createElement" } ], 
                    [ "@babel/plugin-transform-runtime", { "helpers": false, "regenerator": true } ],
                    [ 'babel-plugin-lodash' ],
                    [ '@babel/plugin-proposal-class-properties', { 'loose': true } ],
                ],
            },
        }, {
			test: /\.(s*)css$/,
			use: [  
				{ loader: 'file-loader', options: { name: `assets/styles/[name].css`, } },
				{
				    loader: 'postcss-loader',
				    options: {
					    postcssOptions: {
					    	parser: 'postcss-safe-parser',
	    					plugins: {
						      	autoprefixer: true,
						      	cssnano: {
								  	preset: ['default', { discardComments: { removeAll: true } }]
								}
						    },
					    }
					}
				},
				'sass-loader' 
			]
        }, ],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.scss'],
		modules: [
			'../node_modules',
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin( {
			patterns: [ {
				from: `${ source }/fonts/*.(ttf|otf|eot|woff2?|png|jpe?g|gif|svg|ico)`,
				to: `assets/fonts`,
				flatten: true
			}, {
				from: `${ source }/images`,
				to: `assets/images`,
				flatten: true
			}, {
				from: `${ source }/web`,
				to: '.',
				flatten: false
			} ],
		} ),
	    new StyleLintPlugin( {
	    	syntax: 'scss',
	    	configFile: path.resolve( 'build/.stylelintrc.js'),
	    	fix: false
    	} ),
		new FriendlyErrorsWebpackPlugin(),
		new webpack.LoaderOptionsPlugin({
		    options: {
		    	postcss: [
		        	autoprefixer(),
		    	]
		    }
		}), 
		new CssnanoPlugin({
	    	test: /.s?css$/,
	    }), 
		new UglifyJsPlugin({
	    	test: /\.min\.js$/,
	    	exclude: /node_modules/,
	        uglifyOptions: {
	            compress: {},
	            mangle: true,
	        }
	    })
	],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
};

module.exports = [ webpackConfig ]
