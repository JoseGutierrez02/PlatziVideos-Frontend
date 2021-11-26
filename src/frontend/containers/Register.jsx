import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { registerUser, setError } from '../actions';
import Header from '../components/Header';
import '../assets/styles/components/Register.scss';

const Register = (props) => {
  const [form, setValues] = useState({
    email: '',
    name: '',
    password: '',
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
    if (!form.email || !form.password || !form.password) {
      event.preventDefault();
      props.setError('Todos los campos son obligatorios');
    } else {
      event.preventDefault();
      props.registerUser(form, '/login');
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

      <Header isRegister />
      <section className='register'>
        <section className='register__container'>
          <h2>Regístrate</h2>
          <form 
            className='register__container--form' 
            onSubmit={handleSubmit}
            autoComplete='off'
          >
            <input 
              name='name'
              aria-label='Nombre' 
              className='input' 
              type='text' 
              placeholder='Nombre'
              onChange={handleInput}
            />
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
              aria-label='Contaseña' 
              className='input' 
              type='password' 
              placeholder='Contraseña'
              onChange={handleInput}
            />
            <button className='button' type='submit'>Registrarme</button>
          </form>
          <p className='register__container--login'>
            Ya tienes cuenta? 
            <Link to='/login'>
              Inicia sesión
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
  registerUser,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
