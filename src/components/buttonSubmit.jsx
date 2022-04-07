import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import RecipesContext from '../contexts/RecipesContext';
import '../styles/login.css';

function ButtonSubmit() {
  const {
    email,
    disabled,
  } = useContext(RecipesContext);

  const history = useHistory();

  const HandleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('cocktailsToken', '1');
    const saveEmail = JSON.stringify({ email });
    localStorage.setItem('user', saveEmail);
    if (localStorage.getItem('user')) {
      history.push('/comidas');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-3 login_container">
      <button
        type="button"
        data-testid="login-submit-btn"
        disabled={ disabled }
        onClick={ HandleSubmit }
        className="btn login_btn"
      >
        Enviar
      </button>
    </div>
  );
}

export default ButtonSubmit;
