// API credentials
const APP_ID = 'YOUR_APP_ID';
const APP_KEY = 'YOUR_APP_KEY';

// DOM elements
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const suggestBtn = document.querySelector('#suggest-btn');
const resultsSection = document.querySelector('#results');
const loadMoreBtn = document.querySelector('#load-more-btn');

// API variables
let searchQuery = '';
let from = 0;
let to = 9;
let recipes = [];

// Event listeners
searchForm.addEventListener('submit', handleSearch);
searchBtn.addEventListener('click', handleSearch);
suggestBtn.addEventListener('click', suggestRecipe);
loadMoreBtn.addEventListener('click', loadMore);

function handleSearch(event) {
  event.preventDefault();
  console.log('Search button clicked');
  searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    from = 0;
    to = 9;
    resultsSection.innerHTML = '';
    fetchRecipes(searchQuery, from, to);
  }
}



// Fetch recipes
async function fetchRecipes(query, from, to, clearResults) {
  const url = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${from}&to=${to}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (clearResults) {
      recipes = data.hits;
      resultsSection.innerHTML = '';
    } else {
      recipes = [...recipes, ...data.hits];
    }
    displayRecipes(recipes);
  } catch (error) {
    console.log(error);
  }
}

// Display recipes
function displayRecipes(recipes) {
  if (recipes.length > 0) {
    resultsSection.innerHTML = '';
    recipes.forEach((recipe) => {
      const recipeCard = `
        <div class="recipe">
          <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
          <h2>${recipe.recipe.label}</h2>
          <p><strong>Calories:</strong> ${Math.round(recipe.recipe.calories)}</p>
          <a href="${recipe.recipe.url}" target="_blank">Get recipe</a>
        </div>
      `;
      resultsSection.insertAdjacentHTML('beforeend', recipeCard);
    });
    if (recipes.length >= 10) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } else {
    resultsSection.innerHTML = '<p>No recipes found.</p>';
    loadMoreBtn.style.display = 'none';
  }
}

// Load more recipes
function loadMore() {
  from += 10;
  to += 10;
  fetchRecipes(searchQuery, from, to, false);
}

// Suggest recipe
async function suggestRecipe() {
  const randomQuery = getRandomQuery();
  const url = `https://api.edamam.com/search?q=${randomQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=2`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const suggestedRecipes = data.hits;
    let recipeCards = '';
    suggestedRecipes.forEach((recipe) => {
      const suggestedRecipe = recipe.recipe;
      const recipeCard = `
        <div class="recipe">
          <img src="${suggestedRecipe.image}" alt="${suggestedRecipe.label}">
          <h2>${suggestedRecipe.label}</h2>
          <p><strong>Calories:</strong> ${Math.round(suggestedRecipe.calories)}</p>
          <a href="${suggestedRecipe.url}" target="_blank">Get recipe</a>
        </div>
      `;
      recipeCards += recipeCard;
    });
    resultsSection.innerHTML = recipeCards;
    loadMoreBtn.style.display = 'none';
  } catch (error) {
    console.log(error);
  }
}

// Get random query
function getRandomQuery() {
  const queries = ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'tofu', 'tempeh', 'lentils', 'beans', 'quinoa', 'rice', 'pasta', 'potatoes', 'sweet potatoes', 'carrots', 'broccoli', 'cauliflower', 'spinach', 'kale', 'lettuce', 'cucumber', 'tomatoes', 'bell peppers', 'onions', 'garlic', 'ginger', 'lemon', 'lime', 'orange', 'grapefruit', 'apples', 'bananas', 'berries', 'avocado', 'olives', 'coconut', 'almonds', 'cashews', 'peanuts', 'walnuts', 'pistachios', 'hazelnuts', 'sunflower seeds', 'pumpkin seeds', 'chia seeds', 'flaxseeds', 'sesame seeds', 'poppy seeds', 'honey', 'maple syrup', 'agave nectar', 'coconut sugar', 'brown sugar', 'white sugar', 'molasses', 'balsamic vinegar', 'red wine vinegar', 'apple cider vinegar', 'soy sauce', 'tamari', 'hoisin sauce', 'fish sauce', 'mayonnaise', 'mustard', 'ketchup', 'hot sauce', 'salsa', 'hummus', 'yogurt', 'sour cream', 'cream cheese', 'cheddar cheese', 'parmesan cheese', 'feta cheese', 'mozzarella cheese', 'goat cheese', 'blue cheese', 'eggs', 'milk', 'butter', 'flour', 'yeast', 'baking powder', 'baking soda', 'cocoa powder', 'chocolate chips', 'vanilla extract', 'cinnamon', 'nutmeg', 'cloves', 'cardamom', 'rosemary', 'thyme', 'basil', 'oregano', 'paprika', 'cumin', 'coriander', 'turmeric'];
  const randomNumber = Math.floor(Math.random() * queries.length);
  return queries[randomNumber];
}


