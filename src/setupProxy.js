const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs')

const target = process.env.REACT_APP_PROXY || 'http://localhost'

fs.appendFile(
  './setupProxy.log',
  `${(new Date()).toISOString()} target=${target}\n`,
  (err) => console.error(err)
);

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
