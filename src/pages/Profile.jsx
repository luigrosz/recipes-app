import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Profile() {
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleClickFavorite = () => {
    history.push('/receitas-feitas');
  };

  const handleClickDone = () => {
    history.push('/receitas-favoritas');
  };

  const logout = () => {
    localStorage.clear();
    history.push('/');
  };

  useEffect(() => {
    const getEmail = JSON.parse(localStorage.getItem('user'));
    if (getEmail) {
      setEmail(getEmail.email);
    }
  }, []);

  return (
    <div>
      <Header title="Perfil" showSearchIcon={ false } />
      <div>
        <div>
          <p data-testid="profile-email">{ email }</p>
        </div>
        <div className="select-buttons buttons-alignment">
          <button
            type="button"
            data-testid="profile-done-btn"
            className="btn buttons"
            onClick={ () => handleClickFavorite() }
          >
            Receitas Feitas
          </button>
          <button
            type="button"
            data-testid="profile-favorite-btn"
            className="btn buttons"
            onClick={ () => handleClickDone() }
          >
            Receitas Favoritas
          </button>
          <button
            type="button"
            data-testid="profile-logout-btn"
            className="btn buttons"
            onClick={ () => logout() }
          >
            Sair
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
