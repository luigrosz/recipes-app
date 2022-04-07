import React from 'react';
import { useHistory } from 'react-router-dom';
import { fetchRandomMeal } from '../services/comidasApi';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ExploreFoods() {
  const history = useHistory();

  const randomMeal = async () => {
    const meal = await fetchRandomMeal();
    const id = meal[0].idMeal;
    history.push(`/comidas/${id}`);
  };

  return (
    <div>
      <Header title="Explorar Comidas" showSearchIcon={ false } />
      <div>
        <button
          type="button"
          data-testid="explore-by-ingredient"
          className="buttons"
          onClick={ () => history.push('/explorar/comidas/ingredientes') }
        >
          Por Ingredientes
        </button>

        <button
          type="button"
          data-testid="explore-by-area"
          className="buttons"
          onClick={ () => history.push('/explorar/comidas/area') }
        >
          Por Local de Origem
        </button>

        <button
          type="button"
          data-testid="explore-surprise"
          className="btn buttons"
          onClick={ randomMeal }
        >
          Me Surpreenda!
        </button>
      </div>
      <Footer />
    </div>
  );
}
