/* eslint-disable array-callback-return */
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
import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import passport from 'passport';
import axios from 'axios';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import getManifest from './getManifest';
import { config } from './config';

const app = express();
const { env, port } = config;

app.use(express.json());
app.use(cookieParser());

// Basic Strategy
require('./utils/auth/strategies/basic');

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
    }),
  );
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['vendors.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

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
      <script src="${vendorBuild}" type="text/javascript"></script>
    </body>
    </html>
    `;
};

const renderApp = async (req, res) => {
  let initialState;
  const { email, name, id, token } = req.cookies;

  try {
    let { data: moviesList } = await axios({
      url: `${config.apiUrl}/api/movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });

    let { data: userMovies } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });

    moviesList = moviesList.data;
    userMovies = userMovies.data;
    const myList = [];

    if (userMovies && userMovies.length > 0) {
      userMovies.map((userMovie) => {
        moviesList.filter((movie) => {
          if (userMovie.movieId === movie._id) {
            const moviee = movie;
            moviee['userMovieId'] = userMovie._id;
            myList.push(moviee);
          }
        });
      });
    }

    initialState = {
      user: {
        id, email, name,
      },
      playing: {},
      search: [],
      myList,
      trends: moviesList.filter((movie) => movie.category === 'trends' && movie._id),
      originals: moviesList.filter((movie) => movie.category === 'originals' && movie._id),
    };
  } catch (err) {
    initialState = {
      user: {},
      playing: {},
      search: [],
      myList: [],
      trends: [],
      originals: [],
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = (initialState.user.id);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>,
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post('/auth/sign-in', async (req, res, next) => {
  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async (error) => {
        if (error) {
          next(error);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev,
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: {
        'email': user.email,
        'name': user.name,
        'password': user.password,
      },
    });

    res.status(201).json({
      name: user.name,
      email: user.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/user-movies', async (req, res, next) => {
  try {
    const { body: userMovie } = req;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: userMovie,
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete('/user-movies/:userMovieId', async (req, res, next) => {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.get('*', renderApp);

app.listen(port, (err) => {
  if (err) console.error(err);
  else console.log(`Server running in http://localhost:${port}`);
});
