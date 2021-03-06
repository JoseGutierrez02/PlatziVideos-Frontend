import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import gravatar from '../utils/gravatar';
import { logoutRequest } from '../actions';
import '../assets/styles/components/Header.scss';
import logo from '../assets/static/logo-platzi.png';
import userIcon from '../assets/static/user-icon.png';

const Header = (props) => {
  const { user, isLogin, isRegister, isNotFound } = props;
  const hasUser = (user.id);

  const handleLogout = () => {
    document.cookie = 'email=';
    document.cookie = 'name=';
    document.cookie = 'id=';
    document.cookie = 'token=';
    props.logoutRequest({});
    window.location.href = '/login';
  };
  
  const headerClass = classNames('header', {
    isLogin,
    isRegister,
    isNotFound,
  });

  return (
    <header className={headerClass}>
      <Link to='/'>
        <img className='header__img' src={logo} alt='Platzi Video Logo' />
      </Link>
      <div className='header__menu'>
        <div className='header__menu--profile'>
          {hasUser ? 
            <img src={gravatar(user.email)} alt={user.email} /> :
            <img src={userIcon} alt='User' /> 
          }
          <p>Perfil</p>
        </div>
        <ul>
          {hasUser ?
            <li><a href='/'>{user.name}</a></li> :
            null
          }
          {hasUser ?
            <li><a href='#logout' onClick={handleLogout}>Cerrar sesión</a></li> :
            <li>
              <Link to='/login'>
                Iniciar sesión
              </Link>
            </li>
          }
        </ul>
      </div>
    </header>
  );
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = {
  logoutRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
