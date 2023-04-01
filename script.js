const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results');
const loadMoreBtn = document.querySelector('#load-more-btn');
let currentPage = 0;
let currentQuery = '';

// Fetch recipes from Edamam API
async function fetchRecipes(query, page) {
  const appID = 'Your_APP_ID';
  const appKey = 'Your_App_KEY';
  const from = page * 12 + 1;
  const to = from + 11;
  const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${appID}&app_key=${appKey}&from=${from}&to=${to}`);
  const data = await response.json();
  return data;
}

// Render recipes in the DOM
function renderRecipes(recipes) {
  recipes.hits.forEach(recipe => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    const img = document.createElement('img');
    img.src = recipe.recipe.image;
    recipeDiv.appendChild(img);

    const title = document.createElement('h2');
    title.textContent = recipe.recipe.label;
    recipeDiv.appendChild(title);

    const calories = document.createElement('p');
    calories.innerHTML = `Calories: ${Math.round(recipe.recipe.calories)} kcal`;
    recipeDiv.appendChild(calories);

    const link = document.createElement('a');
    link.href = recipe.recipe.url;
    link.target = '_blank';
    link.textContent = 'View Recipe';
    recipeDiv.appendChild(link);

    resultsDiv.appendChild(recipeDiv);
  });
}

// Handle search form submission
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentPage = 0;
  currentQuery = searchInput.value.trim();
  resultsDiv.innerHTML = '';
  const data = await fetchRecipes(currentQuery, currentPage);
  renderRecipes(data);
  if (data.more) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
});

// Handle load more button click
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  const data = await fetchRecipes(currentQuery, currentPage);
  renderRecipes(data);
  if (!data.more) {
    loadMoreBtn.style.display = 'none';
  }
});
