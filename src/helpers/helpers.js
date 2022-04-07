export default function setInProgressRecipesLocalStorage(array) {
  localStorage.setItem('inProgressRecipes', JSON.stringify(array));
}
