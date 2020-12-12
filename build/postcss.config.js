/* eslint-disable */
module.exports = ({ file, options }) => {
  return {
    parser: 'postcss-safe-parser',
    plugins: {
      	autoprefixer: true,
      	cssnano: {
		  	preset: ['default', { discardComments: { removeAll: true } }]
		}
    },
  };
};
