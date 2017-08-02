var recipes = {}

function search() {
    var currentResults = document.getElementsByClassName('result');
    while (currentResults[0]) {
        currentResults[0].parentNode.removeChild(currentResults[0]);
    }
    var keyword = document.getElementById('keyword').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/recipes/' + keyword);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var results = document.getElementById('results');
            recipes = JSON.parse(xhr.responseText);
            if (recipes.length > 10) {
                createPager();
                for (var recipe_i = 0; recipe_i < 10; recipe_i++) {
                    loadRecipe(recipes[recipe_i]);
                }
            } else {
                for (var recipe_i = 0; recipe_i < recipes.length; recipe_i++) {
                    loadRecipe(recipes[recipe_i]);
                }
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        search();
    }
}

function loadRecipe(recipe) {
    var recipeElement = document.createElement('div');
    recipeElement.setAttribute('class', 'result');
    var title = document.createElement('h1');
    var link = document.createElement('a');
    link.setAttribute('href', recipe.link);
    link.textContent = recipe.title;
    title.appendChild(link);
    var image = document.createElement('img');
    image.src = recipe.imageLink;
    image.style.width = '400px';
    var ingredients = document.createElement('ul');
    for (var ingredient_i = 0; ingredient_i < recipe.ingredients.length; ingredient_i++) {
        var ingredient = document.createElement('li');
        ingredient.textContent = recipe.ingredients[ingredient_i];
        ingredients.appendChild(ingredient);
    }
    recipeElement.appendChild(title);
    recipeElement.appendChild(image);
    recipeElement.appendChild(ingredients);
    document.getElementById('results').appendChild(recipeElement);
}

function createPager() {
    var pages = Math.ceil(recipes.length / 10);
    for (var page_i = 0; page_i < pages; page_i++) {
        var pageElement = document.createElement('a');
        pageElement.setAttribute('href', '#');
        pageElement.setAttribute('onclick', `goToPage(${page_i})`);
        if (page_i !== pages - 1) {
            pageElement.textContent = (page_i + 1) + ' - ';
        } else {
            pageElement.textContent = page_i + 1;
        }
        document.getElementById('pager').appendChild(pageElement);
    }
}

function goToPage(page) {
    var currentResults = document.getElementsByClassName('result');
    while (currentResults[0]) {
        currentResults[0].parentNode.removeChild(currentResults[0]);
    }
    var firstResult = page * 10;
    if ((page * 10) + 10 > recipes.length) {
        for (var recipe_i = firstResult; recipe_i < recipes.length; recipe_i++) {
            loadRecipe(recipes[recipe_i]);
        }
    } else {
        for (var recipe_i = firstResult; recipe_i < firstResult + 10; recipe_i++) {
            loadRecipe(recipes[recipe_i]);
        }
    }
}
