/* eslint-disable no-param-reassign */
import axios from 'axios';

export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const deleteFavorite = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const searchRequest = (payload) => ({
  type: 'SEARCH_REQUEST',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const registerUser = (payload, redirectUrl) => {
  return (dispatch) => {
    axios.post('/auth/sign-up', payload)
      .then(({ data }) => dispatch(registerRequest(data)))
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((error) => {
        console.log(error);
        dispatch(setError('Ha ocurrido un error, \n verifique sus datos'));
      });
  };
};

export const loginUser = ({ email, password }, redirectUrl) => {
  return (dispatch) => {
    axios({
      url: '/auth/sign-in',
      method: 'post',
      auth: {
        username: email,
        password,
      },
    })
      .then(({ data }) => {
        document.cookie = `email=${data.user.email}`;
        document.cookie = `name=${data.user.name}`;
        document.cookie = `id=${data.user.id}`;
        dispatch(loginRequest(data.user));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((error) => {
        console.log(error);
        dispatch(setError('El usuario y/o contraseña son incorrectos'));
      });
  };
};

export const addFavorite = (userId, movie) => {
  return (dispatch) => {
    axios({
      url: '/user-movies',
      method: 'post',
      data: {
        userId,
        movieId: movie._id,
      },
    })
      .then(({ data }) => {
        if (data.data) {
          movie['userMovieId'] = data.data;
          dispatch(setFavorite(movie));
        }

        if (data.data === null) {
          dispatch(setError('La pelicula ya esta agregada a tus favoritos'));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(setError('Ha ocurrido un error'));
      });
  };
};

export const removeFavorite = (userMovieId) => {
  return (dispatch) => {
    axios({
      url: `/user-movies/${userMovieId}`,
      method: 'delete',
      data: {
        userMovieId,
      },
    })
      .then(() => dispatch(deleteFavorite(userMovieId)))
      .catch((error) => {
        console.log(error);
        dispatch(setError('Ha ocurrido un error'));
      });
  };
};
