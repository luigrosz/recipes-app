export async function fetchDrinkByIngredients(ingredient) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchDrinkByName(name) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchDrinkByLetter(firstLetter) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${firstLetter}`);
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchDrinkByCategories(category) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export function fetchDrinkById(id) {
  return fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((results) => results.json()
      .then((data) => (results
        .ok ? Promise.resolve(data.drinks) : Promise.reject(data.drinks))));
}

export async function fetchDrinkCategories() {
  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchRandomDrink() {
  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchDrinkOnLoad() {
  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const json = await response.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchRecommendedDrinks() {
  try {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const json = await res.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchAllDrinksIngredients() {
  try {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
    const json = await res.json();
    return json.drinks;
  } catch (error) {
    console.log('error', error);
  }
}
