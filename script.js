const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultsDiv = document.querySelector("#results");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  searchForRecipe(searchTerm);
});

async function searchForRecipe(searchTerm) {
  const appId = "Your_App_ID";
  const appKey = "Your_app_Key";
  const response = await fetch(`https://api.edamam.com/search?q=${searchTerm}&app_id=${appId}&app_key=${appKey}&from=0&to=20`);
  const data = await response.json();
  displayResults(data.hits);
}

function displayResults(results) {
  resultsDiv.innerHTML = "";
  results.forEach((result) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");
    recipeDiv.innerHTML = `
      <h2>${result.recipe.label}</h2>
      <img src="${result.recipe.image}">
      <p>Calories: ${result.recipe.calories.toFixed(2)}</p>
      <a href="${result.recipe.url}" target="_blank">View Recipe</a>
    `;
    resultsDiv.appendChild(recipeDiv);
  });
}
