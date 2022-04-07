import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer data-testid="footer">
      <div>
        <Link to="/bebidas">
          <img
            src="/images/drinkIcon.svg"
            alt="drinkIcon"
            data-testid="drinks-bottom-btn"
          />
        </Link>
        <Link to="/explorar">
          <img
            src="images/exploreIcon.svg"
            alt="exploreIcon"
            type="button"
            data-testid="explore-bottom-btn"
          />
        </Link>
        <Link to="/comidas">
          <img
            src="images/mealIcon.svg"
            alt="mealIcon"
            type="button"
            data-testid="food-bottom-btn"
          />
        </Link>
      </div>
    </footer>
  );
}
