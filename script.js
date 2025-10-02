// Edamam V2 direct usage (client-side)
// NOTE: Keys in client-side JS are visible to users.
const APP_ID = 'APP_ID';
const APP_KEY = 'APP_KEY';
const API_BASE = 'https://api.edamam.com/api/recipes/v2';


const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const suggestBtn = document.querySelector('#suggest-btn');
const resultsSection = document.querySelector('#results');
const loadMoreBtn = document.querySelector('#load-more-btn');


let searchQuery = '';
const PAGE_SIZE = 10;
let recipes = [];
let hasMore = false;
let nextPageUrl = null; 


searchForm.addEventListener('submit', handleSearch);
suggestBtn.addEventListener('click', suggestRecipe);
loadMoreBtn.addEventListener('click', loadMore);

function handleSearch(event) {
  event.preventDefault();
  searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    recipes = [];
    hasMore = false;
    nextPageUrl = null;
    resultsSection.innerHTML = '';
    const url = `${API_BASE}?type=public&q=${encodeURIComponent(searchQuery)}&app_id=${APP_ID}&app_key=${APP_KEY}&size=${PAGE_SIZE}`;
    fetchRecipesV2(url, true);
  }
}



async function fetchRecipesV2(url, clearResults = false) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const hits = data.hits || [];
    if (clearResults) {
      recipes = hits;
    } else {
      recipes = [...recipes, ...hits];
    }
    nextPageUrl = data?._links?.next?.href || null;
    hasMore = Boolean(nextPageUrl);
    displayRecipes(recipes);
  } catch (error) {
    console.error(error);
    resultsSection.innerHTML = '<p>Something went wrong. Please try again.</p>';
    loadMoreBtn.style.display = 'none';
  }
}

function displayRecipes(recipes) {
  if (recipes.length > 0) {
    resultsSection.innerHTML = '';
    recipes.forEach((recipe) => {
      const recipeCard = `
        <div class="recipe">
          <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
          <h2>${recipe.recipe.label}</h2>
          <div class="meta"><span class="badge">Calories: ${Math.round(recipe.recipe.calories)}</span></div>
          <a href="${recipe.recipe.url}" target="_blank" rel="noopener noreferrer">Get recipe</a>
        </div>
      `;
      resultsSection.insertAdjacentHTML('beforeend', recipeCard);
    });
    loadMoreBtn.style.display = hasMore ? 'block' : 'none';
  } else {
    resultsSection.innerHTML = '<p>No recipes found.</p>';
    loadMoreBtn.style.display = 'none';
  }
}

function loadMore() {
  if (!nextPageUrl) {
    loadMoreBtn.style.display = 'none';
    return;
  }
  fetchRecipesV2(nextPageUrl, false);
}

async function suggestRecipe(event) {
  if (event) event.preventDefault();
  const randomQuery = getRandomQuery();
  const url = `${API_BASE}?type=public&q=${encodeURIComponent(randomQuery)}&app_id=${APP_ID}&app_key=${APP_KEY}&size=2&random=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const suggestedRecipes = data.hits || [];
    recipes = suggestedRecipes;
    hasMore = false;
    nextPageUrl = null;
    displayRecipes(recipes);
  } catch (error) {
    console.error(error);
    resultsSection.innerHTML = '<p>Could not load suggestions. Please try again.</p>';
    loadMoreBtn.style.display = 'none';
  }
}

function getRandomQuery() {
 
  const queries = [
    // proteins
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'turkey', 'lamb', 'duck',
    'tofu', 'tempeh', 'seitan', 'eggs', 'lentils', 'beans', 'chickpeas',
    // carbs & grains
    'quinoa', 'rice', 'brown rice', 'couscous', 'bulgur', 'buckwheat', 'barley', 'oats', 'pasta', 'noodles',
    // veggies & fruit
    'potatoes', 'sweet potatoes', 'carrots', 'broccoli', 'cauliflower', 'spinach', 'kale', 'zucchini', 'eggplant', 'mushrooms',
    'tomatoes', 'cucumber', 'bell peppers', 'onions', 'garlic', 'ginger', 'avocado', 'apples', 'bananas', 'berries', 'mango', 'pineapple',
    // herbs & spices
    'basil', 'oregano', 'rosemary', 'thyme', 'cilantro', 'parsley', 'mint', 'paprika', 'cumin', 'coriander', 'turmeric', 'curry', 'chili',
    // world cuisines
    'italian', 'mexican', 'indian', 'thai', 'japanese', 'korean', 'chinese', 'vietnamese', 'greek', 'turkish', 'french', 'spanish', 'moroccan', 'lebanese', 'brazilian', 'caribbean', 'lithuanian', 'polish', 'german', 'scandinavian',
    // dishes
    'soup', 'stew', 'curry', 'stir fry', 'tacos', 'burrito', 'quesadilla', 'pizza', 'pasta bake', 'risotto', 'paella', 'casserole',
    'salad', 'bowl', 'wrap', 'sandwich', 'burger', 'meatballs', 'kebab', 'sushi', 'ramen', 'pho', 'dumplings', 'gnocchi',
    // breakfast & snacks
    'pancakes', 'waffles', 'omelette', 'oatmeal', 'smoothie', 'granola', 'avocado toast', 'shakshuka',
    // cooking methods
    'grilled', 'roasted', 'baked', 'air fryer', 'slow cooker', 'instant pot', 'sheet pan', 'one pot',
    // diets & vibes
    'vegan', 'vegetarian', 'keto', 'paleo', 'gluten free', 'high protein', 'low carb', 'dairy free',
    // seasonal & occasions
    'summer salad', 'fall soup', 'winter stew', 'spring vegetables', 'holiday dinner', 'bbq', 'picnic', 'game day',
    // sauces & extras
    'pesto', 'tahini', 'peanut sauce', 'teriyaki', 'harissa', 'chimichurri', 'tzatziki', 'salsa verde'
  ];
  const randomNumber = Math.floor(Math.random() * queries.length);
  return queries[randomNumber];
}
