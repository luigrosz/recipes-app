import React, { useContext } from 'react';
import RecipesContext from '../contexts/RecipesContext';
import '../styles/login.css';

function InputPassword() {
  const {
    handlePassword,
    password,
  } = useContext(RecipesContext);

  return (
    <div className="input-group mb-2">
      <span className="input-group-text">
        <i className="fas fa-key" />
      </span>
      <input
        type="password"
        data-testid="password-input"
        value={ password }
        onChange={ handlePassword }
        className="form-control input_pass"
        placeholder="password"
      />
    </div>
  );
}

export default InputPassword;
