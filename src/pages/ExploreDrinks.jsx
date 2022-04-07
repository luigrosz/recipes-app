import React from 'react';
import { useHistory } from 'react-router-dom';
import { fetchRandomDrink } from '../services/bebidasApi';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ExploreDrinks() {
  const history = useHistory();

  const randomDrink = async () => {
    const drink = await fetchRandomDrink();
    const id = drink[0].idDrink;
    history.push(`/bebidas/${id}`);
  };

  return (
    <div>
      <Header title="Explorar Bebidas" showSearchIcon={ false } />
      <div>
        <button
          type="button"
          data-testid="explore-by-ingredient"
          className="btn buttons"
          onClick={ () => history.push('/explorar/bebidas/ingredientes') }
        >
          Por Ingredientes
        </button>
        <button
          type="button"
          data-testid="explore-surprise"
          className="btn buttons"
          onClick={ randomDrink }
        >
          Me Surpreenda!
        </button>
      </div>
      <Footer />
    </div>
  );
}
