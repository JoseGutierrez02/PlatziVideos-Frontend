/* eslint-disable global-require */
import express from 'express';
import webpack from 'webpack';
import helmet from 'helmet';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import initialState from '../frontend/initialState';
import getManifest from './getManifest';
import { config } from './config';

const app = express();
const { env, port } = config;

if (env === 'development') {
  console.log('Development mode');
  const webpackConfig = require('../../webpack.config.dev');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = { publicPath: webpackConfig.output.publicPath };

  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  console.log('Production mode');
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'sha256-TnPJEmXkZeJDhbxx9SrBPs7/mVLUG6tTD5FR+QwO+4w='",
        ],
        'img-src': ["'self'", 'http://dummyimage.com'],
        'style-src-elem': ["'self'", 'https://fonts.googleapis.com'],
        'font-src': ['https://fonts.gstatic.com'],
        'media-src': ['*'],
      },
    })
  );
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Platzi Video</title>
      <link rel="stylesheet" href="${mainStyles}" type="text/css">
    </head>
    <body>
      <div id="app">${html}</div>
      <script>
        window.__PRELOADED_STATE__ =
          ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="${mainBuild}" type="text/javascript"></script>
    </body>
    </html>
    `;
};

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes)}
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.get('*', renderApp);

app.listen(port, (err) => {
  if (err) console.error(err);
  else console.log(`Server running in http://localhost:${port}`);
});
