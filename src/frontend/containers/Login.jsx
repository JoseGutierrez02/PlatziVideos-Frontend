import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { loginUser, setError } from '../actions';
import Header from '../components/Header';
import '../assets/styles/components/Login.scss';
// import googleIcon from '../assets/static/google-icon.png';

const Login = (props) => {
  const [form, setValues] = useState({
    email: '',
  });
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (props.error && props.error.info) {
      setAlert(true);
    }
  }, [props.error]);

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    if (!form.email || !form.password) {
      event.preventDefault();
      props.setError('Todos los campos son obligatorios');
    } else {
      event.preventDefault();
      props.loginUser(form, '/');
    }
  };

  const handleConfirm = () => {
    props.setError('');
    setAlert(false);
  };

  return (
    <>
      <SweetAlert
        title='Whoops!'
        onConfirm={handleConfirm}
        show={alert}
        customButtons={
          <button
            className='dismiss-alert-button' 
            onClick={handleConfirm}
          >
            OK
          </button>
        }
      >
        {props.error && props.error.info ? props.error.info : 'Ha habido un error'}
      </SweetAlert>

      <Header isLogin />
      <section className='login'>
        <section className='login__container'>
          <h2>Inicia sesión</h2>
          <form 
            className='login__container--form' 
            onSubmit={handleSubmit}
            autoComplete='off'
          >
            <input 
              name='email'
              aria-label='Correo' 
              className='input' 
              type='text' 
              placeholder='Correo'
              onChange={handleInput}
            />
            <input
              name='password' 
              aria-label='Contraseña' 
              className='input' 
              type='password' 
              placeholder='Contraseña' 
              onChange={handleInput}
            />
            <button type='submit' className='button'>Iniciar sesión</button>
          </form>
          {/* <section className='login__container--social-media'>
            <div>
              <img src={googleIcon} alt='Google Icon' />Inicia sesión con google
            </div>
          </section> */}
          <p className='login__container--register'>
            No tienes ninguna cuenta?
            <Link to='/register'>
              Regístrate
            </Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapStateToProps = ({ error }) => ({
  error,
});

const mapDispatchToProps = {
  loginUser,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
