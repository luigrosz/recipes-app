import React, { useContext } from 'react';
import RecipesContext from '../contexts/RecipesContext';
import '../styles/login.css';
import ButtonSubmit from './buttonSubmit';
import InputPassword from './inputPassword';

function InputEmail() {
  const { handleEmail, email } = useContext(RecipesContext);

  return (
    <form>
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="fas fa-user" />
        </span>
        <input
          type="email"
          data-testid="email-input"
          value={ email }
          onChange={ handleEmail }
          className="form-control input_user"
          placeholder="email"
        />
      </div>
      <InputPassword />
      <ButtonSubmit />
    </form>
  );
}

export default InputEmail;
