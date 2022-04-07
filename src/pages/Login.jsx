import React from 'react';
import InputEmail from '../components/inputEmail';
import Logo from '../components/logo';
import '../styles/login.css';

function Login() {
  return (
    <div className="container h-100">
      <div className="d-flex justify-content-center h-100">
        <div className="user_card">
          <div className="d-flex justify-content-center">
            <Logo />
          </div>
          <div className="d-flex justify-content-center form_container">
            <InputEmail />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
