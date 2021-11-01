import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../actions';
import Header from '../components/Header';
import '../assets/styles/components/Register.scss';

const Register = (props) => {
  const [form, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.registerUser(form, '/login');
  };

  return (
    <>
      <Header isRegister />
      <section className='register'>
        <section className='register__container'>
          <h2>Regístrate</h2>
          <form className='register__container--form' onSubmit={handleSubmit}>
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

const mapDispatchToProps = {
  registerUser,
};

export default connect(null, mapDispatchToProps)(Register);
